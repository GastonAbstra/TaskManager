import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { AuthService } from './auth-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LoginApiRequest } from './login-api-request';
import { pipe, tap, exhaustMap, catchError, of, throwError, map } from 'rxjs';
import { Router } from '@angular/router';
import { TokenModel } from './token.model';
import { UserApiService } from '../../user/data-access/user-api.service';
import { UserModel } from '../../user/user.model';

type AuthState = {
  error: string | null;
  loading: boolean;
  token: TokenModel | null;
  currentUser: UserModel | null;
  sessionExpiredDialogOpen: boolean;
};

const initialState: AuthState = {
  error: null,
  loading: false,
  token: null,
  currentUser: null,
  sessionExpiredDialogOpen: false,
};

const TOKEN_KEY = `auth_token_storage_key`;

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    authService: inject(AuthService),
    userApiService: inject(UserApiService),
    router: inject(Router),
  })),
  withComputed(({ token }) => ({
    accessToken: computed(() => token()?.accessToken ?? null),
    refreshToken: computed(() => token()?.refreshToken ?? null),
    tokenValid: computed(() => {
      const t = token();
      if (!t) return false;
      return !!t.accessToken && !!t.refreshToken && new Date(t.expiresAt) > new Date();
    }),
  })),
  withMethods(({ authService, router, userApiService, ...store }) => ({
    markSessionExpired: () => {
      patchState(store, { loading: false, sessionExpiredDialogOpen: true });
    },

    refreshAccessToken() {
      const refreshToken = store.refreshToken();

      if (!refreshToken) {
        patchState(store, { sessionExpiredDialogOpen: true });
        return throwError(() => new Error('Refresh token not found'));
      }

      return authService.refresh(refreshToken).pipe(
        map((res) => {
          const newTokens = new TokenModel(res.accessToken, res.refreshToken, res.expiresIn);
          patchState(store, { token: newTokens });
          return newTokens;
        }),
        catchError((err) => {
          patchState(store, { token: null, currentUser: null });
          return throwError(() => err);
        })
      );
    },

    logout: () => {
      patchState(store, { ...initialState });
      router.navigateByUrl('/auth/signin');
    },

    login: rxMethod<LoginApiRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        exhaustMap((request) =>
          authService.login(request).pipe(
            tap({
              next: (response) => {
                const tokenModel = new TokenModel(response.accessToken, response.refreshToken, response.expiresIn);
                patchState(store, { token: tokenModel, sessionExpiredDialogOpen: false });
                
                userApiService.getMe().subscribe({
                  next: (user) => {
                    if(typeof(user.data?.id) === 'number'){
                      const currentUser = new UserModel(
                        user.data?.id,
                        user.data?.email
                      );
                      patchState(store, { currentUser, loading: false });
                      router.navigateByUrl('/');
                    }
                  },
                  error: () => patchState(store, { loading: false, error: 'Error loading profile' })
                });
              },
              error: (err) => patchState(store, { loading: false, error: err.error?.detail || 'Authentication error' })
            })
          )
        )
      )
    ),

    loadLoggedUserData: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        exhaustMap(() =>
          userApiService.getMe().pipe(
            tap((user) => {
              if (typeof(user.data?.id) === 'number') {
                const currentUser = new UserModel(user.data?.id, user.data?.email);
                patchState(store, { loading: false, currentUser });
              }
              else {
                patchState(store, { loading: false, error: user.problemDetails?.detail });
              }
            })
          )
        )
      )
    ),
  })),
  withHooks({
    onInit(store) {
      const storage = localStorage.getItem(TOKEN_KEY);
      if (storage) {
        patchState(store, { token: JSON.parse(storage) });
      }
      
      setTimeout(() => {
          if (store.tokenValid() && !store.currentUser()) {
            store.loadLoggedUserData();
          }
      }, 0);

      effect(() => {
        const token = store.token();
        if (token) {
          localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      });
    },
  }),
);
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthStore } from './auth.store';
import { TokenModel } from './token.model';

const PUBLIC_ENDPOINTS = [
  'api/login',
  'api/refresh',
];

let ongoingRefresh$: Observable<TokenModel> | null = null;

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authStore = inject(AuthStore);

  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => request.url.includes(endpoint));

  const addAuthHeader = (req: HttpRequest<unknown>, token: string | null) => {
    return token 
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) 
      : req;
  };

  const currentToken = authStore.accessToken();
  const authRequest = isPublicEndpoint ? request : addAuthHeader(request, currentToken);

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicEndpoint) {
        const refreshToken = authStore.refreshToken();

        if (!refreshToken) {
          authStore.markSessionExpired();
          return throwError(() => error);
        }

        if (!ongoingRefresh$) {
          ongoingRefresh$ = authStore.refreshAccessToken().pipe(
            finalize(() => (ongoingRefresh$ = null)),
            shareReplay(1)
          );
        }

        return ongoingRefresh$.pipe(
          switchMap((newToken) => next(addAuthHeader(request, newToken.accessToken))),
          catchError((refreshError) => {
            authStore.markSessionExpired();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
}
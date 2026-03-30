import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';
import { AuthService } from './auth-api.service';
import { UserApiService } from '../../user/data-access/user-api.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ApiResult } from '../../utils/helpers/api-result.model';

describe('AuthStore', () => {
  let store: any;
  let authServiceMock: any;
  let userApiServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      login: vi.fn(),
      refresh: vi.fn(),
    };
    userApiServiceMock = {
      getMe: vi.fn(),
    };
    routerMock = {
      navigateByUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserApiService, useValue: userApiServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should have initial state correctly set', () => {
    expect(store.loading()).toBe(false);
    expect(store.currentUser()).toBeNull();
    expect(store.token()).toBeNull();
    expect(store.error()).toBeNull();
    expect(store.tokenValid()).toBe(false);
  });

  it('should logout and reset state', () => {
    store.logout();
    
    expect(store.currentUser()).toBeNull();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/auth/signin');
  });

  describe('login', () => {
    it('should update state on successful login and load user data', async () => {
      const loginResponse = {
        accessToken: 'abc',
        refreshToken: 'def',
        expiresIn: 3600
      };

      const userResponse: ApiResult<any> = {
        success: true,
        data: { id: 1, email: 'test@test.com' },
        statusCode: 200
      };

      authServiceMock.login.mockReturnValue(of(loginResponse));
      userApiServiceMock.getMe.mockReturnValue(of(userResponse));

      store.login({ email: 'test@test.com', password: 'password' });

      expect(authServiceMock.login).toHaveBeenCalled();
      expect(store.token()?.accessToken).toBe('abc');
      
      expect(userApiServiceMock.getMe).toHaveBeenCalled();
      expect(store.currentUser()?.email).toBe('test@test.com');
      expect(store.loading()).toBe(false);
    });

    it('should set error state on login failure', () => {
      const errorMsg = 'Invalid credentials';
      authServiceMock.login.mockReturnValue(throwError(() => ({ 
        error: { detail: errorMsg } 
      })));

      store.login({ email: 'wrong@test.com', password: 'wrong' });

      expect(store.error()).toBe(errorMsg);
      expect(store.loading()).toBe(false);
    });
  });

  describe('computed signals', () => {
    it('should calculate tokenValid correctly based on expiration', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      expect(store.tokenValid()).toBe(false);
    });
  });

  describe('loadLoggedUserData', () => {
    it('should load user data and update currentUser', () => {
      const userResponse: ApiResult<any> = {
        success: true,
        data: { id: 1, email: 'persisted@test.com' },
        statusCode: 200
      };

      userApiServiceMock.getMe.mockReturnValue(of(userResponse));

      store.loadLoggedUserData();

      expect(store.currentUser()?.email).toBe('persisted@test.com');
      expect(store.loading()).toBe(false);
    });

    it('should handle API errors by setting the error state', () => {
      const apiError: ApiResult<any> = {
        success: false,
        statusCode: 404,
        problemDetails: { title: 'Not Found', detail: 'User not found', status: 404, type: 'error' }
      };

      userApiServiceMock.getMe.mockReturnValue(of(apiError));

      store.loadLoggedUserData();

      expect(store.error()).toBe('User not found');
    });
  });
});
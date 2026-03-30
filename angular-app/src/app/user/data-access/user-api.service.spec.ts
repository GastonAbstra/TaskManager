import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { of, map, catchError } from 'rxjs';

import { UserApiService } from './user-api.service';
import { CreateUserApiRequest } from './create-user-api-request.model';
import { UserApiResponse } from './user-api-response.model';
import { ApiHelperService } from '../../utils/helpers/api-helper.service';
import { ApiResult } from '../../utils/helpers/api-result.model';

describe('UserApiService', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;

  const mockApiHelper = {
    handleRequest: vi.fn((req$) => 
      req$.pipe(
        map((res: any) => ({
          success: true,
          data: res.body,
          statusCode: res.status
        } as ApiResult<any>))
      )
    )
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiHelperService, useValue: mockApiHelper }
      ],
    });

    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create()', () => {
    it('should send a POST request to api/user and return successful ApiResult', async () => {
      const mockRequest: CreateUserApiRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponseData: UserApiResponse = {
        id: 1,
        email: 'test@example.com'
      };

      // Call the service method
      service.create(mockRequest).subscribe((result) => {
        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockResponseData);
        expect(result.statusCode).toBe(201);
      });

      const req = httpMock.expectOne('api/user');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);

      req.flush(mockResponseData, { status: 201, statusText: 'Created' });
      
      expect(mockApiHelper.handleRequest).toHaveBeenCalled();
    });
  });

  describe('getMe()', () => {
    it('should send a GET request to api/user/me', () => {
      const mockUser: UserApiResponse = { id: 1, email: 'me@test.com' };

      service.getMe().subscribe((result) => {
        expect(result.data).toEqual(mockUser);
      });

      const req = httpMock.expectOne('api/user/me');
      expect(req.request.method).toBe('GET');
      
      req.flush(mockUser);
    });

    it('should trigger the handleRequest logic on error', () => {
      mockApiHelper.handleRequest.mockImplementationOnce((req$) => req$.pipe(
        catchError(() => of({
            success: false,
            statusCode: 401,
            problemDetails: { title: 'Unauthorized', status: 401, type: 'auth_error' }
        } as ApiResult<any>))
      ));

      service.getMe().subscribe((result) => {
        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(401);
      });

      const req = httpMock.expectOne('api/user/me');
      req.flush({}, { status: 401, statusText: 'Unauthorized' });

      expect(mockApiHelper.handleRequest).toHaveBeenCalled();
    });
  });
});
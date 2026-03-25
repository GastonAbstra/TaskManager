import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginApiRequest } from './login-api-request';
import { LoginApiResponse } from './login-api-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);

  public login = (request: LoginApiRequest): Observable<LoginApiResponse> => {
    const path = 'api/login';
    return this.httpClient.post<LoginApiResponse>(path, request);
  };

  public refresh = (refreshToken: string): Observable<LoginApiResponse> => {
    const path = 'api/refresh';
    return this.httpClient.post<LoginApiResponse>(path, { refreshToken });
  };
}
import { inject, Injectable } from '@angular/core';
import { CreateUserApiRequest } from './create-user-api-request.model';
import { UserApiResponse } from './user-api-response.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiHelperService } from '../../utils/helpers/api-helper.service';
import { ApiResult } from '../../utils/helpers/api-result.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private httpClient = inject(HttpClient);
  private apiHelper = inject(ApiHelperService);
  private readonly path = 'api/user';

  public create = (request: CreateUserApiRequest): Observable<ApiResult<UserApiResponse>> => {
    const request$ = this.httpClient.post<UserApiResponse>(this.path, request, { observe: 'response'});
    const response = this.apiHelper.handleRequest(request$);
    return response;
  }

  public getMe = ():Observable<ApiResult<UserApiResponse>> => {
    const request$ = this.httpClient.get<UserApiResponse>(`${this.path}/me`, { observe: 'response' });
    const response = this.apiHelper.handleRequest(request$);
    return response;
  }
}

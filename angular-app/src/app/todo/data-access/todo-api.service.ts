import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TodoApiResponseModel } from './todo-api-response.model';
import { CreateTodoApiRequestModel } from './create-todo-api-request.model';
import { ApiHelperService } from '../../utils/helpers/api-helper.service';
import { Observable } from 'rxjs';
import { ApiResult } from '../../utils/helpers/api-result.model';
import { UpdateTodoApiRequestModel } from './update-todo-api-request.model';
import { GetTodoApiRequestModel } from './get-todo-api-request.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {

  private httpClient = inject(HttpClient);
  private readonly apiHelper = inject(ApiHelperService);
  private readonly requestPath = 'api/todo';
  
  create = (request: CreateTodoApiRequestModel): Observable<ApiResult<TodoApiResponseModel>>  => {
    const request$ = this.httpClient.post<TodoApiResponseModel>(this.requestPath, request, { observe: 'response' });
    const response = this.apiHelper.handleRequest(request$);
    return response;
  }
  get = (request: GetTodoApiRequestModel): Observable<ApiResult<TodoApiResponseModel[]>> => {
    const getRequestPath = `${this.requestPath}/${request.userId}`;
    const request$ = this.httpClient.get<TodoApiResponseModel[]>(getRequestPath, { observe: 'response' });
    const response = this.apiHelper.handleRequest(request$)
    return response;
  }

  update = (request: UpdateTodoApiRequestModel): Observable<ApiResult<TodoApiResponseModel>> => {
   const request$ = this.httpClient.put<TodoApiResponseModel>( this.requestPath, request, { observe: 'response' } );
    const response = this.apiHelper.handleRequest(request$);
    return response;
  }

  delete = (todoId: string): Observable<ApiResult<TodoApiResponseModel>> => {
    const deleteRequestPath = `${this.requestPath}/${todoId}`;
    const request$ = this.httpClient.delete<TodoApiResponseModel>( deleteRequestPath, { observe: 'response' } );
    const response = this.apiHelper.handleRequest(request$);
    return response;
  }

}

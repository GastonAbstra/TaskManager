import { Injectable } from '@angular/core';
import { ApiResult } from './api-result.model';
import { ProblemDetails } from './problem-details.model';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiHelperService {
  public handleRequest<T>(source$: Observable<HttpResponse<T>>): Observable<ApiResult<T>> {
    return source$.pipe(
      map((response: HttpResponse<T>) => {
        const apiResponse = this.success<T>(response.status, response.body);
        return apiResponse;
      }),
      catchError((error: HttpErrorResponse) => {
        const problemDetails = error.error as ProblemDetails;
        const apiResponse = this.error<T>(problemDetails);
        return of(apiResponse);
      })
    );
  }

  private success<T>(statusCode: number, data?: T | null): ApiResult<T> {
    return { 
      success: true,
      data,
      statusCode 
    };
  }

  private error<T>(problemDetails: ProblemDetails): ApiResult<T> {
    return { 
      success: false,
      statusCode: problemDetails.status,
      problemDetails 
    };
  }
}

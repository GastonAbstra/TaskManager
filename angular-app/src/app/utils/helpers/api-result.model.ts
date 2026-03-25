import { ProblemDetails } from './problem-details.model';

export interface ApiResult<T> {
  success: boolean;
  data?: T | null; // The data returned from the API, or null if the request failed
  statusCode: number;
  problemDetails?: ProblemDetails;
}

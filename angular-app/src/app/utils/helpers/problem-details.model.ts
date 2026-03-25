export interface ProblemDetails {
  type: string; // A URI reference that identifies the problem type. (e.g., "https://example.com/probs/out-of-credit")
  title: string; // A short, human-readable summary of the problem type. (e.g., "You do not have enough credit.")
  status: number; // The HTTP status code (e.g., 400, 401, 404, 500).
  detail?: string; // A human-readable explanation specific to this occurrence of the problem.
  instance?: string; // A URI reference that identifies the specific occurrence of the problem. (e.g., "/account/12345/msgs/abc")
  // You can also add custom members, for example, for validation errors:
  errors?: { [key: string]: string[] }; // For validation errors (e.g., property name -> list of error messages)
}

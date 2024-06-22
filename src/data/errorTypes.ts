export interface ResponseError {
  error: string;
  details?: string;
}

export interface ValidationError {
  error: string;
  details?: { path: string; message: string }[];
}

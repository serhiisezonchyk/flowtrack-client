import { ResponseError, ValidationError } from '@/types';
import { isAxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isValidationError(error: any): error is ValidationError {
  return (
    error.response?.data &&
    typeof error.response?.data.error === 'string' &&
    Array.isArray(error.response?.data.details) &&
    error.response?.data.details.every(
      (detail: any) => typeof detail.path === 'string' && typeof detail.message === 'string',
    )
  );
}
export const errorHandler = (error: any) => {
  if (isAxiosError(error) && isValidationError(error)) {
    return {
      error: error.response?.data.error,
      details: error.response?.data.details?.map((detail: any) => `${detail.path}: ${detail.message}`).join(', ') || '',
    };
  } else if (isAxiosError<ResponseError>(error)) {
    return {
      error: error.response?.data.error || 'Something went wrong',
      details: error.response?.data.details || '',
    };
  } else {
    return {
      error: 'Something went wrong',
      details: '',
    };
  }
};

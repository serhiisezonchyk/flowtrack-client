import { ResponseError } from '@/data/errorTypes';
import { isAxiosError } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const errorHandler = (
  error: unknown
): { error: string; details: string } => {
  if (isAxiosError<ResponseError>(error)) {
    return {
      error: error.response?.data.error || 'Something went wrong',
      details: error.response?.data?.details || '',
    };
  } else {
    return {
      error: 'Something went wrong',
      details: '',
    };
  }
};

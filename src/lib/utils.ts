import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB 
export const SUPPORTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

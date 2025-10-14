import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  // If the filePath already starts with http, return as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // If the filePath doesn't start with /, add it
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  
  return `${baseUrl}${normalizedPath}`;
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath: string | null | undefined, forceRefresh: boolean = false): string | null {
  if (!filePath) return null;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  // If the filePath already starts with http, return as is
  if (filePath.startsWith('http')) {
    return forceRefresh ? `${filePath}?t=${Date.now()}` : filePath;
  }
  
  // If the filePath doesn't start with /, add it
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  
  const fullUrl = `${baseUrl}${normalizedPath}`;
  return forceRefresh ? `${fullUrl}?t=${Date.now()}` : fullUrl;
}
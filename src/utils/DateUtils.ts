/**
 * Date utility functions for sitemap generation
 * 
 * This module provides utilities for date formatting and validation
 * according to sitemap standards.
 */

/**
 * Convert a date to ISO 8601 format as required by sitemap protocol
 * 
 * @param date - Date to format (Date object or ISO string)
 * @returns ISO 8601 formatted date string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    // Validate and normalize the date string
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date string: ${date}`);
    }
    return parsedDate.toISOString();
  }
  
  if (!(date instanceof Date)) {
    throw new Error('Date must be a Date object or ISO string');
  }
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid Date object');
  }
  
  return date.toISOString();
}

/**
 * Format date for Google News sitemap (RFC 3339 format)
 * 
 * @param date - Date to format
 * @returns RFC 3339 formatted date string
 */
export function formatNewsDate(date: Date | string): string {
  const isoDate = formatDate(date);
  // Google News expects RFC 3339 format, which is the same as ISO 8601
  return isoDate;
}

/**
 * Format date in W3C Datetime format (can include just date part)
 * 
 * @param date - Date to format
 * @param includeTime - Whether to include time portion (default: true)
 * @returns W3C datetime formatted string
 */
export function formatW3CDate(date: Date | string, includeTime = true): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  if (includeTime) {
    return dateObj.toISOString();
  } else {
    return dateObj.toISOString().split('T')[0] ?? '';
  }
}

/**
 * Validate if a date string is in a valid format for sitemaps
 * 
 * @param dateString - Date string to validate
 * @returns True if date is valid
 */
export function isValidDate(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Validate if a date is not in the future (for lastmod dates)
 * 
 * @param date - Date to validate
 * @returns True if date is not in the future
 */
export function isValidLastModDate(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    return dateObj <= now;
  } catch {
    return false;
  }
}

/**
 * Get current date in ISO format for sitemap usage
 * 
 * @returns Current date in ISO 8601 format
 */
export function getCurrentDate(): string {
  return new Date().toISOString();
}

/**
 * Parse various date formats and return a normalized Date object
 * 
 * @param date - Date in various formats
 * @returns Normalized Date object
 */
export function parseDate(date: Date | string | number): Date {
  if (date instanceof Date) {
    return new Date(date.getTime()); // Create a copy
  }
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Unable to parse date: ${String(date)}`);
  }
  
  return parsedDate;
}

/**
 * Check if two dates represent the same day (ignoring time)
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are on the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  try {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch {
    return false;
  }
}
/**
 * URL validation utilities for sitemap generation
 * 
 * This module provides comprehensive URL validation following
 * sitemap protocol requirements and best practices.
 */

// URL is a global in Node.js 18+

/**
 * Check if a string is a valid URL format
 * 
 * @param url - URL string to validate
 * @returns True if URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    
    // Must be HTTP or HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Must have a hostname
    if (!urlObj.hostname) {
      return false;
    }
    
    // URL must not be too long (reasonable limit)
    if (url.length > 2048) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if URL is accessible (basic format check, not HTTP request)
 * 
 * @param url - URL to check
 * @returns True if URL appears accessible
 */
export function isAccessibleUrl(url: string): boolean {
  if (!isValidUrl(url)) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    
    // Check for localhost or private IPs (might not be accessible by search engines)
    const hostname = urlObj.hostname.toLowerCase();
    
    // Localhost variations
    if (['localhost', '127.0.0.1', '::1'].includes(hostname)) {
      return false;
    }
    
    // Private IP ranges (basic check)
    if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalize URL by removing fragments and unnecessary elements
 * 
 * @param url - URL to normalize
 * @returns Normalized URL
 */
export function normalizeUrl(url: string): string {
  if (!isValidUrl(url)) {
    return url; // Return as-is if invalid
  }

  try {
    const urlObj = new URL(url);
    
    // Remove fragment
    urlObj.hash = '';
    
    // Ensure trailing slash for directory URLs (simple heuristic)
    if (urlObj.pathname === '' || urlObj.pathname === '/') {
      urlObj.pathname = '/';
    }
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Check if URL matches domain restrictions
 * 
 * @param url - URL to check
 * @param allowedDomains - Array of allowed domains (optional)
 * @returns True if URL is allowed
 */
export function isDomainAllowed(url: string, allowedDomains?: string[]): boolean {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true; // No restrictions
  }

  if (!isValidUrl(url)) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return allowedDomains.some(domain => {
      const normalizedDomain = domain.toLowerCase();
      return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`);
    });
  } catch {
    return false;
  }
}

/**
 * Extract domain from URL
 * 
 * @param url - URL to extract domain from
 * @returns Domain string or null if invalid
 */
export function extractDomain(url: string): string | null {
  if (!isValidUrl(url)) {
    return null;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Check if URL has a valid file extension for web content
 * 
 * @param url - URL to check
 * @returns True if URL has valid web extension or no extension
 */
export function hasValidWebExtension(url: string): boolean {
  if (!isValidUrl(url)) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    // If no extension, assume it's fine (could be a directory or dynamic content)
    if (!pathname.includes('.')) {
      return true;
    }
    
    // Valid web extensions
    const validExtensions = [
      '.html', '.htm', '.php', '.asp', '.aspx', '.jsp', '.cfm',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.txt', '.xml', '.rss', '.atom'
    ];
    
    return validExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Resolve relative URL against a base URL
 * 
 * @param url - URL that might be relative
 * @param baseUrl - Base URL to resolve against
 * @returns Resolved absolute URL
 */
export function resolveUrl(url: string, baseUrl: string): string {
  if (!url) {
    return url;
  }

  // If already absolute, return as-is
  if (isValidUrl(url)) {
    return url;
  }

  // Try to resolve relative URL
  try {
    const resolved = new URL(url, baseUrl);
    return resolved.toString();
  } catch {
    return url; // Return original if resolution fails
  }
}
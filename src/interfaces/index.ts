/**
 * Core interfaces for @rumenx/sitemap classes
 * 
 * This file defines the main interfaces that classes must implement.
 */

import type {
  SitemapItem,
  SitemapIndexItem,
  SitemapItemInput,
  SitemapAddOptions,
  SitemapConfig,
  SitemapFormat,
  SitemapStats,
  ChangeFrequency,
  RenderOptions,
  BaseRenderer,
} from '../types/index.js';

/**
 * Interface for the main Sitemap class
 */
export interface ISitemap {
  /**
   * Add a single sitemap item using explicit parameters
   * 
   * @param url - The URL of the page
   * @param lastmod - Last modification date (optional)
   * @param priority - Priority of this URL (0.0 to 1.0, optional)
   * @param changefreq - How frequently the page changes (optional)
   * @param options - Additional options (images, videos, etc., optional)
   * @returns This sitemap instance for chaining
   */
  add(
    url: string,
    lastmod?: string | Date,
    priority?: number,
    changefreq?: ChangeFrequency,
    options?: SitemapAddOptions
  ): this;

  /**
   * Add one or more sitemap items using object/array data
   * 
   * @param items - Single item or array of items to add
   * @returns This sitemap instance for chaining
   */
  addItem(items: SitemapItemInput): this;

  /**
   * Get all sitemap items
   * 
   * @returns Array of all sitemap items
   */
  getItems(): SitemapItem[];

  /**
   * Get the number of items in the sitemap
   * 
   * @returns Number of items
   */
  getItemCount(): number;

  /**
   * Clear all items from the sitemap
   * 
   * @returns This sitemap instance for chaining
   */
  clear(): this;

  /**
   * Remove items that match the given predicate function
   * 
   * @param predicate - Function to test each item
   * @returns This sitemap instance for chaining
   */
  removeItems(predicate: (item: SitemapItem) => boolean): this;

  /**
   * Get statistics about the sitemap
   * 
   * @returns Statistics object
   */
  getStats(): SitemapStats;

  /**
   * Render the sitemap in the specified format
   * 
   * @param format - Output format (default: 'xml')
   * @param options - Rendering options
   * @returns Rendered sitemap as string
   */
  render(format?: SitemapFormat, options?: RenderOptions): string;

  /**
   * Render the sitemap as XML (convenience method)
   * 
   * @param options - Rendering options
   * @returns XML string
   */
  toXML(options?: RenderOptions): string;

  /**
   * Render the sitemap as plain text (convenience method)
   * 
   * @param options - Rendering options
   * @returns Text string with URLs
   */
  toTXT(options?: RenderOptions): string;

  /**
   * Render the sitemap as HTML (convenience method)
   * 
   * @param options - Rendering options
   * @returns HTML string
   */
  toHTML(options?: RenderOptions): string;

  /**
   * Validate all items in the sitemap
   * 
   * @returns Array of validation errors (empty if valid)
   */
  validate(): import('../types').ValidationError[];

  /**
   * Check if the sitemap has reached the maximum recommended size
   * 
   * @returns True if sitemap should be split
   */
  shouldSplit(): boolean;
}

/**
 * Interface for the SitemapIndex class
 */
export interface ISitemapIndex {
  /**
   * Add a sitemap reference to the index
   * 
   * @param url - URL of the sitemap file
   * @param lastmod - Last modification date (optional)
   * @returns This index instance for chaining
   */
  addSitemap(url: string, lastmod?: string | Date): this;

  /**
   * Add multiple sitemap references to the index
   * 
   * @param sitemaps - Array of sitemap index items
   * @returns This index instance for chaining
   */
  addSitemaps(sitemaps: SitemapIndexItem[]): this;

  /**
   * Get all sitemap references
   * 
   * @returns Array of all sitemap index items
   */
  getSitemaps(): SitemapIndexItem[];

  /**
   * Get the number of sitemaps in the index
   * 
   * @returns Number of sitemap references
   */
  getSitemapCount(): number;

  /**
   * Clear all sitemap references from the index
   * 
   * @returns This index instance for chaining
   */
  clear(): this;

  /**
   * Reset the index with new sitemap references
   * 
   * @param sitemaps - New array of sitemap index items
   * @returns This index instance for chaining
   */
  resetSitemaps(sitemaps: SitemapIndexItem[]): this;

  /**
   * Render the sitemap index as XML
   * 
   * @param options - Rendering options
   * @returns XML string
   */
  toXML(options?: RenderOptions): string;

  /**
   * Validate all sitemap references in the index
   * 
   * @returns Array of validation errors (empty if valid)
   */
  validate(): import('../types').ValidationError[];
}

/**
 * Interface for the internal data model
 */
export interface IModel {
  /**
   * Add a sitemap item to the internal storage
   * 
   * @param item - The sitemap item to add
   */
  addItem(item: SitemapItem): void;

  /**
   * Get all stored sitemap items
   * 
   * @returns Array of sitemap items
   */
  getItems(): SitemapItem[];

  /**
   * Clear all stored items
   */
  clear(): void;

  /**
   * Get the configuration
   * 
   * @returns Configuration object
   */
  getConfig(): SitemapConfig;

  /**
   * Check if escaping is enabled
   * 
   * @returns True if escaping is enabled
   */
  getEscaping(): boolean;

  /**
   * Add a sitemap index item
   * 
   * @param sitemap - The sitemap index item to add
   */
  addSitemap(sitemap: SitemapIndexItem): void;

  /**
   * Get all stored sitemap index items
   * 
   * @returns Array of sitemap index items
   */
  getSitemaps(): SitemapIndexItem[];

  /**
   * Reset sitemap index items
   * 
   * @param sitemaps - New array of sitemap index items
   */
  resetSitemaps(sitemaps: SitemapIndexItem[]): void;
}

/**
 * Interface for renderer factory
 */
export interface IRendererFactory {
  /**
   * Get a renderer for the specified format
   * 
   * @param format - The output format
   * @returns Renderer instance
   */
  getRenderer(format: SitemapFormat): BaseRenderer;

  /**
   * Register a custom renderer
   * 
   * @param format - The format this renderer handles
   * @param renderer - The renderer instance
   */
  registerRenderer(format: SitemapFormat, renderer: BaseRenderer): void;

  /**
   * Check if a renderer is available for the format
   * 
   * @param format - The format to check
   * @returns True if renderer is available
   */
  hasRenderer(format: SitemapFormat): boolean;

  /**
   * Get all supported formats
   * 
   * @returns Array of supported format names
   */
  getSupportedFormats(): SitemapFormat[];
}

/**
 * Interface for validation utilities
 */
export interface IValidator {
  /**
   * Validate a URL
   * 
   * @param url - URL to validate
   * @returns True if valid
   */
  isValidUrl(url: string): boolean;

  /**
   * Validate a priority value
   * 
   * @param priority - Priority to validate
   * @returns True if valid
   */
  isValidPriority(priority: number): boolean;

  /**
   * Validate a date
   * 
   * @param date - Date to validate
   * @returns True if valid
   */
  isValidDate(date: string | Date): boolean;

  /**
   * Validate a complete sitemap item
   * 
   * @param item - Item to validate
   * @returns Array of validation errors
   */
  validateItem(item: SitemapItem): import('../types').ValidationError[];

  /**
   * Validate a sitemap index item
   * 
   * @param item - Index item to validate
   * @returns Array of validation errors
   */
  validateIndexItem(item: SitemapIndexItem): import('../types').ValidationError[];
}
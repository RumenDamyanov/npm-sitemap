/**
 * Internal data model for storing sitemap items and configuration
 * 
 * This class manages the internal storage of sitemap items and sitemap index entries,
 * along with configuration settings like escaping and validation.
 */

import type {
  SitemapItem,
  SitemapIndexItem,
  SitemapConfig,
} from '../types/SitemapTypes.js';
import type { IModel } from '../interfaces/index.js';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<SitemapConfig> = {
  escaping: true,
  validate: true,
  maxItems: 50000,
  baseUrl: '',
  pretty: false,
  stylesheet: '',
  namespaces: {},
};

/**
 * Model class for managing sitemap data and configuration
 */
export class Model implements IModel {
  private items: SitemapItem[] = [];
  private sitemaps: SitemapIndexItem[] = [];
  private config: Required<SitemapConfig>;

  /**
   * Create a new Model instance
   * 
   * @param config - Optional configuration object
   */
  constructor(config: SitemapConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Add a sitemap item to the internal storage
   * 
   * @param item - The sitemap item to add
   */
  addItem(item: SitemapItem): void {
    this.items.push(item);
  }

  /**
   * Get all stored sitemap items
   * 
   * @returns Array of sitemap items
   */
  getItems(): SitemapItem[] {
    return [...this.items];
  }

  /**
   * Clear all stored items
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Get the configuration
   * 
   * @returns Configuration object
   */
  getConfig(): Required<SitemapConfig> {
    return { ...this.config };
  }

  /**
   * Check if escaping is enabled
   * 
   * @returns True if escaping is enabled
   */
  getEscaping(): boolean {
    return this.config.escaping;
  }

  /**
   * Add a sitemap index item
   * 
   * @param sitemap - The sitemap index item to add
   */
  addSitemap(sitemap: SitemapIndexItem): void {
    this.sitemaps.push(sitemap);
  }

  /**
   * Get all stored sitemap index items
   * 
   * @returns Array of sitemap index items
   */
  getSitemaps(): SitemapIndexItem[] {
    return [...this.sitemaps];
  }

  /**
   * Reset sitemap index items
   * 
   * @param sitemaps - New array of sitemap index items
   */
  resetSitemaps(sitemaps: SitemapIndexItem[]): void {
    this.sitemaps = [...sitemaps];
  }

  /**
   * Get the number of items
   * 
   * @returns Number of items
   */
  getItemCount(): number {
    return this.items.length;
  }

  /**
   * Get the number of sitemap references
   * 
   * @returns Number of sitemap references
   */
  getSitemapCount(): number {
    return this.sitemaps.length;
  }

  /**
   * Check if the sitemap has reached the maximum recommended size
   * 
   * @returns True if sitemap should be split
   */
  shouldSplit(): boolean {
    return this.items.length >= this.config.maxItems;
  }
}
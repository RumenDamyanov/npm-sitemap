/**
 * SitemapIndex class for managing multiple sitemaps
 * 
 * When you have a large number of URLs, it's recommended to split them into
 * multiple sitemap files and create a sitemap index that references them.
 */

import type {
  SitemapIndexItem,
  SitemapIndexConfig,
  SitemapStats,
  ValidationError,
  RenderOptions,
} from '../types/SitemapTypes.js';
import type { ISitemapIndex } from '../interfaces/index.js';
import { formatDate } from '../utils/DateUtils.js';
import { normalizeUrl, resolveUrl } from '../validators/UrlValidator.js';
import { DataValidator } from '../validators/DataValidator.js';

/**
 * SitemapIndex class for managing multiple sitemap files
 */
export class SitemapIndex implements ISitemapIndex {
  private items: SitemapIndexItem[] = [];
  private config: SitemapIndexConfig;
  private validator: DataValidator;

  /**
   * Default configuration
   */
  private static readonly DEFAULT_CONFIG: Required<SitemapIndexConfig> = {
    validate: true,
    escaping: true,
    pretty: true,
    baseUrl: '',
    stylesheet: '',
    maxSitemaps: 50000, // Maximum number of sitemaps in an index
  };

  /**
   * Create a new SitemapIndex instance
   * 
   * @param config - Optional configuration object
   */
  constructor(config: SitemapIndexConfig = {}) {
    this.config = { ...SitemapIndex.DEFAULT_CONFIG, ...config };
    this.validator = new DataValidator();
  }

  /**
   * Add a sitemap to the index
   * 
   * @param loc - URL of the sitemap file
   * @param lastmod - Last modification date (optional)
   * @returns This sitemap index instance for chaining
   */
  addSitemap(loc: string, lastmod?: string | Date): this {
    // Normalize and resolve URL
    let normalizedUrl = normalizeUrl(loc);
    if (this.config.baseUrl && !this.validator.isValidUrl(normalizedUrl)) {
      normalizedUrl = resolveUrl(loc, this.config.baseUrl);
    }

    const item: SitemapIndexItem = {
      loc: normalizedUrl,
    };

    if (lastmod !== undefined) {
      item.lastmod = lastmod instanceof Date ? formatDate(lastmod) : lastmod;
    }

    // Validate if validation is enabled
    if (this.config.validate) {
      const errors = this.validateSitemapItem(item);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => `${error.field}: ${error.message}`).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }

    // Check maximum sitemaps limit
    if (this.items.length >= this.config.maxSitemaps!) {
      throw new Error(`Maximum number of sitemaps (${this.config.maxSitemaps}) exceeded`);
    }

    this.items.push(item);
    return this;
  }

  /**
   * Add multiple sitemaps to the index
   * 
   * @param items - Array of sitemap items to add
   * @returns This sitemap index instance for chaining
   */
  addSitemaps(items: SitemapIndexItem[]): this {
    for (const item of items) {
      this.addSitemap(item.loc, item.lastmod);
    }
    return this;
  }

  /**
   * Get all sitemap items in the index
   * 
   * @returns Array of all sitemap items
   */
  getSitemaps(): SitemapIndexItem[] {
    return [...this.items];
  }

  /**
   * Get the number of sitemaps in the index
   * 
   * @returns Number of sitemaps
   */
  getSitemapCount(): number {
    return this.items.length;
  }

  /**
   * Clear all sitemaps from the index
   * 
   * @returns This sitemap index instance for chaining
   */
  clear(): this {
    this.items = [];
    return this;
  }

  /**
   * Remove sitemaps that match the given predicate function
   * 
   * @param predicate - Function to test each sitemap item
   * @returns This sitemap index instance for chaining
   */
  removeSitemaps(predicate: (item: SitemapIndexItem) => boolean): this {
    this.items = this.items.filter(item => !predicate(item));
    return this;
  }

  /**
   * Reset the index with new sitemap references
   * 
   * @param sitemaps - New array of sitemap index items
   * @returns This sitemap index instance for chaining
   */
  resetSitemaps(sitemaps: SitemapIndexItem[]): this {
    this.items = [];
    this.addSitemaps(sitemaps);
    return this;
  }

  /**
   * Check if a sitemap URL exists in the index
   * 
   * @param url - URL to check
   * @returns True if the sitemap exists
   */
  hasSitemap(url: string): boolean {
    const normalizedUrl = normalizeUrl(url);
    return this.items.some(item => item.loc === normalizedUrl);
  }

  /**
   * Get statistics about the sitemap index
   * 
   * @returns Statistics object
   */
  getStats(): SitemapStats {
    const stats: SitemapStats = {
      urls: this.items.length,
      withImages: 0,
      withVideos: 0,
      withTranslations: 0,
      withAlternates: 0,
      withGoogleNews: 0,
      totalImages: 0,
      totalVideos: 0,
      estimatedSize: 0,
    };

    // Rough estimation of XML size (in bytes)
    // Basic XML structure + URL length + lastmod
    stats.estimatedSize = this.items.reduce((size, item) => {
      let itemSize = 100; // Base XML tags for <sitemap>
      itemSize += item.loc.length;
      if (item.lastmod) itemSize += 30;
      return size + itemSize;
    }, 200); // Base XML declaration and root element

    return stats;
  }

  /**
   * Render the sitemap index as XML
   * 
   * @param options - Rendering options
   * @returns XML string
   */
  render(options: RenderOptions = {}): string {
    return this.toXML(options);
  }

  /**
   * Render the sitemap index as XML
   * 
   * @param options - Rendering options
   * @returns XML string
   */
  toXML(options: RenderOptions = {}): string {
    // Merge options with config
    const pretty = options.pretty ?? this.config.pretty;
    const stylesheet = options.stylesheet ?? this.config.stylesheet;
    
    // Generate XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (stylesheet) {
      xml += `<?xml-stylesheet href="${this.escapeXml(stylesheet)}" type="text/xsl"?>\n`;
    }
    
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add sitemap items
    for (const item of this.items) {
      xml += this.renderSitemapIndexItem(item, pretty ? 1 : 0);
    }
    
    xml += '</sitemapindex>';
    
    return xml;
  }

  /**
   * Validate all sitemap items in the index
   * 
   * @returns Array of validation errors (empty if valid)
   */
  validate(): ValidationError[] {
    const errors: ValidationError[] = [];
    
    this.items.forEach((item, index) => {
      const itemErrors = this.validateSitemapItem(item);
      errors.push(...itemErrors.map(error => ({
        ...error,
        field: `sitemap[${index}].${error.field}`,
      })));
    });
    
    return errors;
  }

  /**
   * Check if the sitemap index has reached the maximum recommended size
   * 
   * @returns True if index should be split (though this is rarely needed)
   */
  shouldSplit(): boolean {
    return this.items.length >= this.config.maxSitemaps!;
  }

  /**
   * Get the current configuration
   * 
   * @returns Current configuration object
   */
  getConfig(): SitemapIndexConfig {
    return { ...this.config };
  }

  /**
   * Update the configuration
   * 
   * @param config - Configuration updates
   * @returns This sitemap index instance for chaining
   */
  setConfig(config: Partial<SitemapIndexConfig>): this {
    this.config = { ...this.config, ...config };
    return this;
  }

  /**
   * Render a single sitemap index item as XML
   * 
   * @param item - Sitemap index item to render
   * @param indent - Indentation level
   * @returns XML string for the item
   */
  private renderSitemapIndexItem(item: SitemapIndexItem, indent = 0): string {
    const indentStr = '  '.repeat(indent);
    let xml = `${indentStr}<sitemap>\n`;
    
    // Required URL
    xml += `${indentStr}  <loc>${this.escapeXml(item.loc)}</loc>\n`;
    
    // Optional last modification date
    if (item.lastmod) {
      xml += `${indentStr}  <lastmod>${item.lastmod}</lastmod>\n`;
    }
    
    xml += `${indentStr}</sitemap>\n`;
    return xml;
  }

  /**
   * Validate a single sitemap index item
   * 
   * @param item - Item to validate
   * @returns Array of validation errors
   */
  private validateSitemapItem(item: SitemapIndexItem): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Validate URL
    if (!this.validator.isValidUrl(item.loc)) {
      errors.push({
        type: 'url',
        field: 'loc',
        message: 'Invalid URL format',
        value: item.loc,
      });
    }
    
    // Validate lastmod if present
    if (item.lastmod && typeof item.lastmod === 'string') {
      try {
        const date = new Date(item.lastmod);
        if (isNaN(date.getTime())) {
          errors.push({
            type: 'date',
            field: 'lastmod',
            message: 'Invalid date format',
            value: item.lastmod,
          });
        }
      } catch {
        errors.push({
          type: 'date',
          field: 'lastmod',
          message: 'Invalid date format',
          value: item.lastmod,
        });
      }
    }
    
    return errors;
  }

  /**
   * Escape XML special characters
   * 
   * @param text - Text to escape
   * @returns Escaped text
   */
  private escapeXml(text: string): string {
    if (!this.config.escaping) {
      return text;
    }
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
/**
 * Main Sitemap class for generating XML sitemaps
 * 
 * This is the primary interface for creating and managing sitemap entries
 * with support for images, videos, translations, and other rich content.
 */

import type {
  SitemapItem,
  SitemapItemInput,
  SitemapAddOptions,
  SitemapConfig,
  SitemapFormat,
  SitemapStats,
  ChangeFrequency,
  ValidationError,
  RenderOptions,
} from '../types/SitemapTypes.js';
import type { ISitemap } from '../interfaces/index.js';
import { Model } from './Model.js';
import { DataValidator } from '../validators/DataValidator.js';
import { formatDate } from '../utils/DateUtils.js';
import { normalizeUrl, resolveUrl } from '../validators/UrlValidator.js';

/**
 * Main Sitemap class
 */
export class Sitemap implements ISitemap {
  private model: Model;
  private validator: DataValidator;

  /**
   * Create a new Sitemap instance
   * 
   * @param config - Optional configuration object
   */
  constructor(config: SitemapConfig = {}) {
    this.model = new Model(config);
    this.validator = new DataValidator();
  }

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
    options: SitemapAddOptions = {}
  ): this {
    const config = this.model.getConfig();
    
    // Normalize and resolve URL
    let normalizedUrl = normalizeUrl(url);
    if (config.baseUrl && !this.validator.isValidUrl(normalizedUrl)) {
      normalizedUrl = resolveUrl(url, config.baseUrl);
    }

    // Create sitemap item
    const item: SitemapItem = {
      loc: normalizedUrl,
      ...options,
    };

    // Add optional fields
    if (lastmod !== undefined) {
      item.lastmod = lastmod instanceof Date ? formatDate(lastmod) : lastmod;
    }

    if (priority !== undefined) {
      item.priority = priority;
    }

    if (changefreq !== undefined) {
      item.changefreq = changefreq;
    }

    // Validate if validation is enabled
    if (config.validate) {
      const errors = this.validator.validateItem(item);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => `${error.field}: ${error.message}`).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }

    this.model.addItem(item);
    return this;
  }

  /**
   * Add one or more sitemap items using object/array data
   * 
   * @param items - Single item or array of items to add
   * @returns This sitemap instance for chaining
   */
  addItem(items: SitemapItemInput): this {
    const itemsArray = Array.isArray(items) ? items : [items];
    const config = this.model.getConfig();

    for (const item of itemsArray) {
      // Normalize and resolve URL
      let normalizedUrl = normalizeUrl(item.loc);
      if (config.baseUrl && !this.validator.isValidUrl(normalizedUrl)) {
        normalizedUrl = resolveUrl(item.loc, config.baseUrl);
      }

      // Create processed item
      const processedItem: SitemapItem = {
        ...item,
        loc: normalizedUrl,
      };

      // Format dates if they are Date objects
      if (processedItem.lastmod instanceof Date) {
        processedItem.lastmod = formatDate(processedItem.lastmod);
      }

      // Validate if validation is enabled
      if (config.validate) {
        const errors = this.validator.validateItem(processedItem);
        if (errors.length > 0) {
          const errorMessages = errors.map(error => `${error.field}: ${error.message}`).join(', ');
          throw new Error(`Validation failed for ${processedItem.loc}: ${errorMessages}`);
        }
      }

      this.model.addItem(processedItem);
    }

    return this;
  }

  /**
   * Get all sitemap items
   * 
   * @returns Array of all sitemap items
   */
  getItems(): SitemapItem[] {
    return this.model.getItems();
  }

  /**
   * Get the number of items in the sitemap
   * 
   * @returns Number of items
   */
  getItemCount(): number {
    return this.model.getItemCount();
  }

  /**
   * Clear all items from the sitemap
   * 
   * @returns This sitemap instance for chaining
   */
  clear(): this {
    this.model.clear();
    return this;
  }

  /**
   * Remove items that match the given predicate function
   * 
   * @param predicate - Function to test each item
   * @returns This sitemap instance for chaining
   */
  removeItems(predicate: (item: SitemapItem) => boolean): this {
    const items = this.model.getItems();
    const filteredItems = items.filter(item => !predicate(item));
    
    // Clear and re-add filtered items
    this.model.clear();
    filteredItems.forEach(item => this.model.addItem(item));
    
    return this;
  }

  /**
   * Get statistics about the sitemap
   * 
   * @returns Statistics object
   */
  getStats(): SitemapStats {
    const items = this.model.getItems();
    
    const stats: SitemapStats = {
      urls: items.length,
      withImages: 0,
      withVideos: 0,
      withTranslations: 0,
      withAlternates: 0,
      withGoogleNews: 0,
      totalImages: 0,
      totalVideos: 0,
      estimatedSize: 0,
    };

    for (const item of items) {
      if (item.images && item.images.length > 0) {
        stats.withImages++;
        stats.totalImages += item.images.length;
      }
      
      if (item.videos && item.videos.length > 0) {
        stats.withVideos++;
        stats.totalVideos += item.videos.length;
      }
      
      if (item.translations && item.translations.length > 0) {
        stats.withTranslations++;
      }
      
      if (item.alternates && item.alternates.length > 0) {
        stats.withAlternates++;
      }
      
      if (item.googlenews) {
        stats.withGoogleNews++;
      }
    }

    // Rough estimation of XML size (in bytes)
    // Basic XML structure + URL length + metadata
    stats.estimatedSize = items.reduce((size, item) => {
      let itemSize = 150; // Base XML tags
      itemSize += item.loc.length;
      if (item.title) itemSize += item.title.length + 15;
      if (item.lastmod) itemSize += 30;
      if (item.images) itemSize += item.images.length * 200;
      if (item.videos) itemSize += item.videos.length * 500;
      if (item.translations) itemSize += item.translations.length * 100;
      if (item.alternates) itemSize += item.alternates.length * 100;
      if (item.googlenews) itemSize += 300;
      return size + itemSize;
    }, 500); // Base XML declaration and root element

    return stats;
  }

  /**
   * Render the sitemap in the specified format
   * 
   * @param format - Output format (default: 'xml')
   * @param options - Rendering options
   * @returns Rendered sitemap as string
   */
  render(format: SitemapFormat = 'xml', options: RenderOptions = {}): string {
    if (format !== 'xml') {
      throw new Error(`Format '${format}' not yet implemented. Currently only 'xml' is supported.`);
    }
    
    return this.toXML(options);
  }

  /**
   * Render the sitemap as XML (convenience method)
   * 
   * @param options - Rendering options
   * @returns XML string
   */
  toXML(options: RenderOptions = {}): string {
    const items = this.model.getItems();
    const config = this.model.getConfig();
    
    // Merge options with config
    const pretty = options.pretty ?? config.pretty;
    const stylesheet = options.stylesheet ?? config.stylesheet;
    
    // Generate XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (stylesheet) {
      xml += `<?xml-stylesheet href="${this.escapeXml(stylesheet)}" type="text/xsl"?>\n`;
    }
    
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    
    // Add namespaces based on content
    const hasImages = items.some(item => item.images && item.images.length > 0);
    const hasVideos = items.some(item => item.videos && item.videos.length > 0);
    const hasTranslations = items.some(item => item.translations && item.translations.length > 0);
    const hasAlternates = items.some(item => item.alternates && item.alternates.length > 0);
    const hasGoogleNews = items.some(item => item.googlenews);
    
    if (hasImages) {
      xml += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
    }
    if (hasVideos) {
      xml += ' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"';
    }
    if (hasTranslations || hasAlternates) {
      xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
    }
    if (hasGoogleNews) {
      xml += ' xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"';
    }
    
    xml += '>\n';
    
    // Add items
    for (const item of items) {
      xml += this.renderSitemapItem(item, pretty ? 1 : 0);
    }
    
    xml += '</urlset>';
    
    return xml;
  }

  /**
   * Render the sitemap as plain text (convenience method)
   * 
   * @returns Text string with URLs
   */
  toTXT(): string {
    const items = this.model.getItems();
    return items.map(item => item.loc).join('\n');
  }

  /**
   * Render the sitemap as HTML (convenience method)
   * 
   * @returns HTML string
   */
  toHTML(): string {
    throw new Error('HTML rendering is not yet implemented');
  }

  /**
   * Validate all items in the sitemap
   * 
   * @returns Array of validation errors (empty if valid)
   */
  validate(): ValidationError[] {
    const items = this.model.getItems();
    const errors: ValidationError[] = [];
    
    items.forEach((item, index) => {
      const itemErrors = this.validator.validateItem(item);
      errors.push(...itemErrors.map(error => ({
        ...error,
        field: `item[${index}].${error.field}`,
      })));
    });
    
    return errors;
  }

  /**
   * Check if the sitemap has reached the maximum recommended size
   * 
   * @returns True if sitemap should be split
   */
  shouldSplit(): boolean {
    return this.model.shouldSplit();
  }

  /**
   * Render a single sitemap item as XML
   * 
   * @param item - Sitemap item to render
   * @param indent - Indentation level
   * @returns XML string for the item
   */
  private renderSitemapItem(item: SitemapItem, indent = 0): string {
    const indentStr = '  '.repeat(indent);
    let xml = `${indentStr}<url>\n`;
    
    // Required URL
    xml += `${indentStr}  <loc>${this.escapeXml(item.loc)}</loc>\n`;
    
    // Optional fields
    if (item.lastmod) {
      xml += `${indentStr}  <lastmod>${item.lastmod}</lastmod>\n`;
    }
    
    if (item.changefreq) {
      xml += `${indentStr}  <changefreq>${item.changefreq}</changefreq>\n`;
    }
    
    if (item.priority !== undefined) {
      xml += `${indentStr}  <priority>${item.priority}</priority>\n`;
    }
    
    // Images
    if (item.images) {
      for (const image of item.images) {
        xml += `${indentStr}  <image:image>\n`;
        xml += `${indentStr}    <image:loc>${this.escapeXml(image.url)}</image:loc>\n`;
        if (image.title) {
          xml += `${indentStr}    <image:title>${this.escapeXml(image.title)}</image:title>\n`;
        }
        if (image.caption) {
          xml += `${indentStr}    <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
        }
        xml += `${indentStr}  </image:image>\n`;
      }
    }
    
    // Videos
    if (item.videos) {
      for (const video of item.videos) {
        xml += `${indentStr}  <video:video>\n`;
        xml += `${indentStr}    <video:thumbnail_loc>${this.escapeXml(video.thumbnail_url)}</video:thumbnail_loc>\n`;
        xml += `${indentStr}    <video:title><![CDATA[${video.title}]]></video:title>\n`;
        xml += `${indentStr}    <video:description><![CDATA[${video.description}]]></video:description>\n`;
        
        if (video.duration !== undefined) {
          xml += `${indentStr}    <video:duration>${video.duration}</video:duration>\n`;
        }
        
        xml += `${indentStr}  </video:video>\n`;
      }
    }
    
    // Translations (hreflang)
    if (item.translations) {
      for (const trans of item.translations) {
        xml += `${indentStr}  <xhtml:link rel="alternate" hreflang="${trans.language}" href="${this.escapeXml(trans.url)}" />\n`;
      }
    }
    
    // Alternates
    if (item.alternates) {
      for (const alt of item.alternates) {
        const media = alt.media ? ` media="${alt.media}"` : '';
        xml += `${indentStr}  <xhtml:link rel="alternate"${media} href="${this.escapeXml(alt.url)}" />\n`;
      }
    }
    
    // Google News
    if (item.googlenews) {
      xml += `${indentStr}  <news:news>\n`;
      xml += `${indentStr}    <news:publication>\n`;
      xml += `${indentStr}      <news:name>${this.escapeXml(item.googlenews.sitename)}</news:name>\n`;
      xml += `${indentStr}      <news:language>${item.googlenews.language}</news:language>\n`;
      xml += `${indentStr}    </news:publication>\n`;
      xml += `${indentStr}    <news:publication_date>${this.formatDate(item.googlenews.publication_date)}</news:publication_date>\n`;
      if (item.googlenews.title) {
        xml += `${indentStr}    <news:title>${this.escapeXml(item.googlenews.title)}</news:title>\n`;
      }
      xml += `${indentStr}  </news:news>\n`;
    }
    
    xml += `${indentStr}</url>\n`;
    return xml;
  }

  /**
   * Escape XML special characters
   * 
   * @param text - Text to escape
   * @returns Escaped text
   */
  private escapeXml(text: string): string {
    const config = this.model.getConfig();
    if (!config.escaping) {
      return text;
    }
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Format date for XML output
   * 
   * @param date - Date to format
   * @returns Formatted date string
   */
  private formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      return date;
    }
    return formatDate(date);
  }
}
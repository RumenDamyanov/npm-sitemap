/**
 * @rumenx/sitemap - XML Sitemap Generator for Node.js
 *
 * A comprehensive library for generating XML sitemaps with support for:
 * - Standard sitemap fields (loc, lastmod, changefreq, priority)
 * - Image sitemaps
 * - Video sitemaps
 * - Multi-language sitemaps (hreflang)
 * - Google News sitemaps
 * - Sitemap index files
 * - Validation and error checking
 * - Multiple output formats (XML, TXT, HTML)
 *
 * @author Rumen Damyanov <contact@rumenx.com>
 * @license MIT
 * @packageDocumentation
 */

// Core classes
export { Sitemap } from './sitemap/Sitemap.js';
export { SitemapIndex } from './sitemap/SitemapIndex.js';
export { Model } from './sitemap/Model.js';

// Interfaces
export type {
  ISitemap,
  ISitemapIndex,
  IModel,
  IRendererFactory,
  IValidator,
} from './interfaces/index.js';

// Types
export type * from './types/index.js';

// Utilities - export individual functions
export { formatDate, isValidDate, parseDate } from './utils/DateUtils.js';

export { escapeXml, createElement, formatXml } from './utils/XmlUtils.js';

export { isValidUrl, normalizeUrl, resolveUrl } from './validators/UrlValidator.js';

export { DataValidator } from './validators/DataValidator.js';

// Package metadata
export const version = '1.0.0';
export const name = '@rumenx/sitemap';

/**
 * Package information and metadata
 * @public
 */
export const packageInfo = Object.freeze({
  name,
  version,
  description:
    'A comprehensive TypeScript package for generating XML sitemaps in Node.js applications',
  author: 'Rumen Damyanov <contact@rumenx.com>',
  repository: 'https://github.com/RumenDamyanov/npm-sitemap',
  license: 'MIT',
} as const);

/**
 * Core type definitions for @rumenx/sitemap
 *
 * This file defines the main interfaces and types used throughout the sitemap package.
 * Based on sitemaps.org protocol and Google sitemap extensions.
 */

/**
 * Valid change frequency values as defined by sitemaps.org protocol
 */
export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

/**
 * Supported output formats for sitemap rendering
 */
export type SitemapFormat = 'xml' | 'txt' | 'html' | 'google-news' | 'rss' | 'ror-rdf';

/**
 * Configuration options for sitemap generation
 */
export interface SitemapConfig {
  /** Enable/disable XML escaping for special characters (default: true) */
  escaping?: boolean;

  /** Enable/disable input validation (default: true) */
  validate?: boolean;

  /** Maximum number of items per sitemap file (default: 50000) */
  maxItems?: number;

  /** Base URL for resolving relative URLs */
  baseUrl?: string;

  /** Pretty-format XML output with indentation (default: false) */
  pretty?: boolean;

  /** Include XML stylesheet reference in output */
  stylesheet?: string;

  /** Custom XML namespaces to include */
  namespaces?: Record<string, string>;
}

/**
 * Image metadata for sitemap entries
 * Based on Google Image sitemap extension
 */
export interface ImageItem {
  /** URL of the image (required) */
  url: string;

  /** Title of the image */
  title?: string;

  /** Caption describing the image */
  caption?: string;

  /** Geographic location of the image */
  geo_location?: string;

  /** License URL for the image */
  license?: string;
}

/**
 * Video metadata for sitemap entries
 * Based on Google Video sitemap extension
 */
export interface VideoItem {
  /** Title of the video (required) */
  title: string;

  /** Description of the video content (required) */
  description: string;

  /** URL of the video thumbnail image (required) */
  thumbnail_url: string;

  /** Duration of the video in seconds */
  duration?: number;

  /** Date when the video expires */
  expiration_date?: string | Date;

  /** Rating of the video (0.0 to 5.0) */
  rating?: number;

  /** Number of times the video has been viewed */
  view_count?: number;

  /** Date when the video was published */
  publication_date?: string | Date;

  /** Whether the video is family-friendly */
  family_friendly?: boolean;

  /** Space-delimited list of countries where the video may or may not be played */
  restriction?: string;

  /** URL pointing to a gallery page containing the video */
  gallery_loc?: string;

  /** Price to download or view the video */
  price?: string;

  /** Whether a subscription or rental is required to view the video */
  requires_subscription?: boolean;

  /** Platform where the video is available (web, mobile, tv) */
  platform?: string;

  /** Whether the video is live */
  live?: boolean;
}

/**
 * Translation/alternate language version for sitemap entries
 * Based on hreflang attribute specification
 */
export interface TranslationItem {
  /** Language code (e.g., 'en', 'fr', 'en-US') (required) */
  language: string;

  /** URL of the alternate language version (required) */
  url: string;
}

/**
 * Alternate version metadata for sitemap entries
 * For mobile, AMP, print versions, etc.
 */
export interface AlternateItem {
  /** Media type or device (e.g., 'handheld', 'print') */
  media?: string;

  /** URL of the alternate version (required) */
  url: string;
}

/**
 * Google News specific metadata for sitemap entries
 * Based on Google News sitemap extension
 */
export interface GoogleNewsItem {
  /** Name of the news publication (required) */
  sitename: string;

  /** Language of the article (required) */
  language: string;

  /** Date and time when the article was published (required) */
  publication_date: string | Date;

  /** Title of the news article */
  title?: string;

  /** Comma-separated list of keywords describing the article */
  keywords?: string;

  /** Comma-separated list of stock ticker symbols */
  stock_tickers?: string;
}

/**
 * Complete sitemap item with all possible metadata
 */
export interface SitemapItem {
  /** URL of the page (required) */
  loc: string;

  /** Last modification date of the page */
  lastmod?: string | Date;

  /** Priority of this URL relative to other URLs (0.0 to 1.0) */
  priority?: number;

  /** How frequently the page is likely to change */
  changefreq?: ChangeFrequency;

  /** Title of the page */
  title?: string;

  /** Array of images associated with the URL */
  images?: ImageItem[];

  /** Array of videos associated with the URL */
  videos?: VideoItem[];

  /** Array of alternate language versions */
  translations?: TranslationItem[];

  /** Array of alternate versions (mobile, print, etc.) */
  alternates?: AlternateItem[];

  /** Google News specific metadata */
  googlenews?: GoogleNewsItem;
}

/**
 * Sitemap index entry for referencing other sitemap files
 */
export interface SitemapIndexItem {
  /** URL of the sitemap file (required) */
  loc: string;

  /** Last modification date of the sitemap file */
  lastmod?: string | Date;
}

/**
 * Batch item data - can be a single item or array of items
 */
export type SitemapItemInput = SitemapItem | SitemapItem[];

/**
 * Simplified item data for the add() method
 */
export interface SitemapAddOptions {
  /** Array of images associated with the URL */
  images?: ImageItem[];

  /** Array of videos associated with the URL */
  videos?: VideoItem[];

  /** Array of alternate language versions */
  translations?: TranslationItem[];

  /** Array of alternate versions (mobile, print, etc.) */
  alternates?: AlternateItem[];

  /** Google News specific metadata */
  googlenews?: GoogleNewsItem;

  /** Title of the page */
  title?: string;
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Type of validation error */
  type: 'url' | 'priority' | 'date' | 'required' | 'format';

  /** Field that failed validation */
  field: string;

  /** Error message */
  message: string;

  /** The invalid value */
  value: unknown;
}

/**
 * Options for rendering sitemap output
 */
export interface RenderOptions {
  /** Output format */
  format?: SitemapFormat;

  /** Include XML stylesheet reference */
  stylesheet?: string;

  /** Pretty-format output with indentation */
  pretty?: boolean;

  /** Custom XML namespaces */
  namespaces?: Record<string, string>;
}

/**
 * Statistics about the sitemap
 */
export interface SitemapStats {
  /** Total number of URLs */
  urls: number;

  /** Number of URLs with images */
  withImages: number;

  /** Number of URLs with videos */
  withVideos: number;

  /** Number of URLs with translations */
  withTranslations: number;

  /** Number of URLs with alternates */
  withAlternates: number;

  /** Number of URLs with Google News data */
  withGoogleNews: number;

  /** Total number of images across all URLs */
  totalImages: number;

  /** Total number of videos across all URLs */
  totalVideos: number;

  /** Estimated file size in bytes */
  estimatedSize: number;
}

/**
 * Configuration options for sitemap index
 */
export interface SitemapIndexConfig {
  /** Base URL for resolving relative URLs */
  baseUrl?: string;

  /** Enable validation of sitemap data */
  validate?: boolean;

  /** Enable XML character escaping */
  escaping?: boolean;

  /** Pretty-format output with indentation */
  pretty?: boolean;

  /** XML stylesheet URL */
  stylesheet?: string;

  /** Maximum number of sitemaps (default: 50,000) */
  maxSitemaps?: number;
}

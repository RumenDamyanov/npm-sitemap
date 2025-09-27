/**
 * Renderer-specific type definitions for @rumenx/sitemap
 * 
 * This file defines types used by the various renderer classes
 * for generating different output formats.
 */

import type { SitemapItem, SitemapIndexItem, SitemapFormat } from './SitemapTypes.js';

/**
 * Base renderer interface that all format renderers must implement
 */
export interface BaseRenderer {
  /** The format this renderer handles */
  format: SitemapFormat;
  
  /** Render an array of sitemap items to string */
  render(items: SitemapItem[], options?: RenderOptions): string;
  
  /** Render sitemap index items to string */
  renderIndex?(items: SitemapIndexItem[], options?: RenderOptions): string;
  
  /** Get the MIME type for this format */
  getMimeType(): string;
  
  /** Get the file extension for this format */
  getFileExtension(): string;
}

/**
 * Options passed to renderers
 */
export interface RenderOptions {
  /** Pretty-format output with indentation */
  pretty?: boolean;
  
  /** Include XML stylesheet reference */
  stylesheet?: string;
  
  /** Custom XML namespaces */
  namespaces?: Record<string, string>;
  
  /** Base URL for resolving relative URLs */
  baseUrl?: string;
  
  /** Channel information for RSS/RDF formats */
  channel?: ChannelInfo;
}

/**
 * Channel information for RSS/RDF formats
 */
export interface ChannelInfo {
  /** Title of the site/channel */
  title: string;
  
  /** URL of the site */
  link: string;
  
  /** Description of the site */
  description?: string;
  
  /** Language of the content */
  language?: string;
  
  /** Copyright information */
  copyright?: string;
  
  /** Managing editor email */
  managingEditor?: string;
  
  /** Webmaster email */
  webMaster?: string;
}

/**
 * XML namespace definitions for different sitemap formats
 */
export interface XmlNamespaces {
  /** Standard sitemap namespace */
  sitemap: string;
  
  /** Image extension namespace */
  image?: string;
  
  /** Video extension namespace */
  video?: string;
  
  /** News extension namespace */
  news?: string;
  
  /** Mobile extension namespace */
  mobile?: string;
  
  /** hreflang namespace */
  xhtml?: string;
  
  /** Custom namespaces */
  [key: string]: string | undefined;
}

/**
 * Default XML namespaces used by the package
 */
export const DEFAULT_NAMESPACES: XmlNamespaces = {
  sitemap: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  image: 'http://www.google.com/schemas/sitemap-image/1.1',
  video: 'http://www.google.com/schemas/sitemap-video/1.1',
  news: 'http://www.google.com/schemas/sitemap-news/0.9',
  mobile: 'http://www.google.com/schemas/sitemap-mobile/1.0',
  xhtml: 'http://www.w3.org/1999/xhtml',
};

/**
 * Renderer factory configuration
 */
export interface RendererConfig {
  /** Format-specific options */
  [format: string]: unknown;
}

/**
 * XML generation options specific to XML renderers
 */
export interface XmlRenderOptions extends RenderOptions {
  /** XML declaration version */
  xmlVersion?: string;
  
  /** XML encoding */
  encoding?: string;
  
  /** Indentation string for pretty formatting */
  indent?: string;
  
  /** Whether to include XML declaration */
  includeDeclaration?: boolean;
  
  /** Whether to validate XML structure */
  validate?: boolean;
}

/**
 * HTML generation options specific to HTML renderer
 */
export interface HtmlRenderOptions extends RenderOptions {
  /** Page title for HTML output */
  title?: string;
  
  /** Custom CSS styles */
  styles?: string;
  
  /** Include JavaScript for table sorting */
  includeTableSorter?: boolean;
  
  /** Template for HTML output */
  template?: string;
}

/**
 * Text generation options specific to TXT renderer
 */
export interface TxtRenderOptions extends RenderOptions {
  /** Line separator */
  separator?: string;
  
  /** Whether to include only URLs (no metadata) */
  urlsOnly?: boolean;
}

/**
 * Stream rendering options for large sitemaps
 */
export interface StreamRenderOptions extends RenderOptions {
  /** Chunk size for streaming */
  chunkSize?: number;
  
  /** Whether to compress output */
  compress?: boolean;
  
  /** Compression level (1-9) */
  compressionLevel?: number;
}
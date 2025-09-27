/**
 * Main type definitions export for @rumenx/sitemap
 *
 * This file re-exports all public types used by the package.
 */

// Core sitemap types
export type {
  ChangeFrequency,
  SitemapFormat,
  SitemapConfig,
  SitemapIndexConfig,
  ImageItem,
  VideoItem,
  TranslationItem,
  AlternateItem,
  GoogleNewsItem,
  SitemapItem,
  SitemapIndexItem,
  SitemapItemInput,
  SitemapAddOptions,
  ValidationError,
  RenderOptions as SitemapRenderOptions,
  SitemapStats,
} from './SitemapTypes.js';

// Renderer types
export type {
  BaseRenderer,
  RenderOptions,
  ChannelInfo,
  XmlNamespaces,
  RendererConfig,
  XmlRenderOptions,
  HtmlRenderOptions,
  TxtRenderOptions,
  StreamRenderOptions,
} from './RenderTypes.js';

// Constants
export { DEFAULT_NAMESPACES } from './RenderTypes.js';

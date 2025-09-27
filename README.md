# @rumenx/sitemap

## 💡 Multi-Language Sitemap Familycenter

[![npm version](https://badge.fury.io/js/@rumenx%2Fsitemap.svg)](https://badge.fury.io/js/@rumenx%2Fsitemap)
[![Node.js CI](https://github.com/RumenDamyanov/npm-sitemap/actions/workflows/ci.yml/badge.svg)](https://github.com/RumenDamyanov/npm-sitemap/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/RumenDamyanov/npm-sitemap/branch/master/graph/badge.svg)](https://codecov.io/gh/RumenDamyanov/npm-sitemap)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@rumenx/sitemap.svg)](https://www.npmjs.com/package/@rumenx/sitemap)

**A comprehensive TypeScript package for generating XML sitemaps in Node.js applications**

_Supporting images, videos, translations, Google News, and more with 100% type safety_

## ✨ Features

- 🎯 **Full TypeScript Support** - Complete type safety and IntelliSense
- 🏗️ **Modern Architecture** - ESM/CJS dual package with tree-shaking support
- 🌐 **Comprehensive Support** - Images, videos, translations, Google News, alternates
- ⚡ **High Performance** - Optimized for large sitemaps with streaming support
- 🔍 **Advanced Validation** - Built-in URL validation and data sanitization
- 📊 **Statistics & Analytics** - Detailed sitemap statistics and insights
- 🎨 **Flexible Output** - XML, TXT formats with customizable styling
- 🌍 **Internationalization** - Full hreflang and multilingual support
- 📱 **Modern Standards** - Follows latest XML sitemap protocol specifications
- 🧪 **Battle Tested** - 97%+ test coverage with 376+ test cases

## 💡 Inspiration

## 📦 Multi-Language Sitemap Family

This package is part of a comprehensive sitemap generation suite created by the same author for multiple programming languages:

- **🐘 PHP**: [RumenDamyanov/php-sitemap](https://github.com/RumenDamyanov/php-sitemap) (formerly laravel-sitemap) - Composer package
- **🐹 Go**: [RumenDamyanov/go-sitemap](https://github.com/RumenDamyanov/go-sitemap) - Go module (go.rumenx.com)
- **🟨 Node.js**: This package - NPM package for JavaScript/TypeScript

All three implementations share the same **core philosophy and feature set**:

- **Comprehensive support** - Images, videos, news, translations, and multilingual content
- **Production-ready architecture** - Built for real-world applications handling large-scale sitemaps
- **Standards compliance** - Full adherence to XML sitemap protocol specifications
- **Developer-friendly APIs** - Intuitive, well-documented interfaces with extensive configuration options

**Node.js/TypeScript enhancements:**

- Full TypeScript support with complete type safety and IntelliSense
- ESM/CJS dual package compatibility for maximum compatibility
- Tree-shaking support for optimal bundle sizes
- Modern async/await patterns and Promise-based workflows
- Enhanced validation with detailed error reporting
- Zero runtime dependencies for minimal footprint

## 📦 Installation

```bash
# npm
npm install @rumenx/sitemap

# yarn
yarn add @rumenx/sitemap

# pnpm
pnpm add @rumenx/sitemap
```

## 🚀 Quick Start

```typescript
import { Sitemap } from '@rumenx/sitemap';

// Create a new sitemap
const sitemap = new Sitemap();

// Add URLs
sitemap
  .add('https://example.com/')
  .add('https://example.com/about', {
    lastmod: new Date(),
    changefreq: 'monthly',
    priority: 0.8,
  })
  .add('https://example.com/products', {
    lastmod: '2023-12-01',
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        url: 'https://example.com/images/product.jpg',
        caption: 'Our amazing product',
      },
    ],
  });

// Generate XML
const xml = sitemap.toXML();
console.log(xml);
```

## 📚 Advanced Usage

### Creating Sitemaps with Rich Media

```typescript
import { Sitemap, SitemapItem } from '@rumenx/sitemap';

const sitemap = new Sitemap({
  baseUrl: 'https://example.com',
  validate: true,
  escapeContent: true,
});

// Add a page with images and videos
const richMediaItem: SitemapItem = {
  loc: '/blog/amazing-post',
  lastmod: new Date(),
  changefreq: 'monthly',
  priority: 0.7,
  images: [
    {
      url: '/images/hero.jpg',
      caption: 'Hero image for amazing post',
      title: 'Amazing Post Hero',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      geoLocation: 'New York, NY',
    },
  ],
  videos: [
    {
      thumbnail_url: '/images/video-thumb.jpg',
      title: 'How to be amazing',
      description: 'A comprehensive guide to being amazing',
      content_url: '/videos/amazing.mp4',
      duration: 300,
      rating: 4.8,
      view_count: 10000,
      publication_date: '2023-12-01',
      family_friendly: true,
      tags: ['tutorial', 'amazing', 'guide'],
    },
  ],
};

sitemap.addItem(richMediaItem);
```

### Multilingual Sitemaps with Hreflang

```typescript
// Add multilingual content
sitemap.add('https://example.com/en/about', {
  translations: [
    { language: 'en', url: 'https://example.com/en/about' },
    { language: 'es', url: 'https://example.com/es/acerca-de' },
    { language: 'fr', url: 'https://example.com/fr/a-propos' },
    { language: 'de', url: 'https://example.com/de/uber-uns' },
  ],
});
```

### Google News Sitemaps

```typescript
sitemap.add('https://example.com/news/breaking-news', {
  news: {
    sitename: 'Example News',
    language: 'en',
    publication_date: new Date(),
    title: 'Breaking: Amazing Discovery Made',
    keywords: 'breaking, news, discovery, science',
  },
});
```

### Mobile and AMP Pages

```typescript
sitemap.add('https://example.com/article', {
  alternates: [
    {
      url: 'https://m.example.com/article',
      media: 'only screen and (max-width: 640px)',
    },
    {
      url: 'https://amp.example.com/article',
    },
  ],
});
```

## 🗂️ Sitemap Index Management

```typescript
import { SitemapIndex } from '@rumenx/sitemap';

const sitemapIndex = new SitemapIndex({
  baseUrl: 'https://example.com',
});

// Add multiple sitemaps
sitemapIndex
  .addSitemap('https://example.com/sitemap-posts.xml', {
    lastmod: new Date(),
  })
  .addSitemap('https://example.com/sitemap-pages.xml')
  .addSitemap('https://example.com/sitemap-products.xml');

// Generate sitemap index XML
const indexXml = sitemapIndex.toXML();
```

## 🛠️ Configuration Options

### Sitemap Configuration

```typescript
interface SitemapConfig {
  /** Base URL for resolving relative URLs */
  baseUrl?: string;
  /** Enable validation of URLs and data */
  validate?: boolean;
  /** Enable XML content escaping */
  escapeContent?: boolean;
  /** Pretty print XML output */
  prettyPrint?: boolean;
  /** Custom XML stylesheet */
  stylesheet?: string;
  /** Maximum items per sitemap (for splitting) */
  maxItems?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Allowed domains for URL validation */
  allowedDomains?: string[];
}
```

### Usage with Configuration

```typescript
const sitemap = new Sitemap({
  baseUrl: 'https://example.com',
  validate: true,
  escapeContent: true,
  prettyPrint: true,
  stylesheet: '/sitemap.xsl',
  maxItems: 50000,
  allowedDomains: ['example.com', 'cdn.example.com'],
});
```

## 📊 Statistics and Analysis

```typescript
// Get detailed sitemap statistics
const stats = sitemap.getStats();
console.log(stats);
// Output:
// {
//   totalItems: 150,
//   totalImages: 45,
//   totalVideos: 12,
//   totalTranslations: 300,
//   totalAlternates: 75,
//   totalNews: 8,
//   averagePriority: 0.7,
//   lastModified: '2023-12-01T10:30:00.000Z',
//   sizeEstimate: 125000
// }

// Check if sitemap should be split
if (sitemap.shouldSplit()) {
  console.log('Sitemap exceeds size limits and should be split');
}
```

## 🔍 Validation and Error Handling

```typescript
// Validate sitemap content
const errors = sitemap.validate();
if (errors.length > 0) {
  console.error('Sitemap validation errors:', errors);
}

// Handle validation in configuration
const sitemap = new Sitemap({
  validate: true, // Throws errors on invalid data
});

try {
  sitemap.add('invalid-url'); // Will throw validation error
} catch (error) {
  console.error('Validation error:', error.message);
}
```

## 📄 Output Formats

### XML Output (Default)

```typescript
const xml = sitemap.toXML({
  prettyPrint: true,
  escapeContent: true,
});
```

### Text Output

```typescript
const txt = sitemap.toTXT();
// Output:
// https://example.com/
// https://example.com/about
// https://example.com/products
```

### Custom Rendering

```typescript
const html = sitemap.render('html'); // Custom HTML format
const xml = sitemap.render('xml', { prettyPrint: false });
```

## 🎨 Advanced Features

### Custom Item Processing

```typescript
// Remove items based on conditions
sitemap.removeItems(item => item.priority < 0.5 || new Date(item.lastmod) < new Date('2023-01-01'));

// Get specific items
const items = sitemap.getItems();
const highPriorityItems = items.filter(item => item.priority > 0.8);
```

### Memory Management

```typescript
// Clear all items
sitemap.clear();

// Get item count without loading all items
const count = sitemap.getItemCount();
```

### URL Resolution

```typescript
const sitemap = new Sitemap({
  baseUrl: 'https://example.com',
});

// Relative URLs are automatically resolved
sitemap.add('/products'); // Becomes https://example.com/products
sitemap.add('about'); // Becomes https://example.com/about
```

## 🧪 TypeScript Support

This package is written in TypeScript and provides complete type definitions:

```typescript
import {
  Sitemap,
  SitemapIndex,
  SitemapItem,
  SitemapIndexItem,
  SitemapConfig,
  SitemapStats,
  ValidationError,
} from '@rumenx/sitemap';

// Full IntelliSense support
const item: SitemapItem = {
  loc: 'https://example.com/page',
  lastmod: new Date(),
  changefreq: 'weekly', // TypeScript will suggest valid values
  priority: 0.8,
  images: [
    /* Fully typed image objects */
  ],
  videos: [
    /* Fully typed video objects */
  ],
};
```

## 📈 Performance

- **Optimized for large sitemaps** - Efficiently handles 50,000+ URLs
- **Memory efficient** - Stream-friendly architecture
- **Fast XML generation** - Optimized string building
- **Minimal dependencies** - Zero runtime dependencies
- **Tree-shakable** - Import only what you need

## 🔧 Integration Examples

### Express.js Integration

```typescript
import express from 'express';
import { Sitemap } from '@rumenx/sitemap';

const app = express();

app.get('/sitemap.xml', (req, res) => {
  const sitemap = new Sitemap({ baseUrl: 'https://example.com' });

  // Add your URLs
  sitemap.add('/').add('/about').add('/contact');

  res.set('Content-Type', 'application/xml');
  res.send(sitemap.toXML());
});
```

### Next.js Integration

```typescript
// pages/api/sitemap.xml.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Sitemap } from '@rumenx/sitemap';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sitemap = new Sitemap({ baseUrl: 'https://yoursite.com' });

  // Add your pages
  sitemap.add('/').add('/about').add('/blog');

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap.toXML());
}
```

### Database Integration

```typescript
import { Sitemap } from '@rumenx/sitemap';
import { getAllPosts, getAllProducts } from './database';

async function generateSitemap() {
  const sitemap = new Sitemap({ baseUrl: 'https://example.com' });

  // Add static pages
  sitemap.add('/').add('/about').add('/contact');

  // Add dynamic content
  const posts = await getAllPosts();
  posts.forEach(post => {
    sitemap.add(`/blog/${post.slug}`, {
      lastmod: post.updatedAt,
      changefreq: 'weekly',
      priority: 0.7,
    });
  });

  const products = await getAllProducts();
  products.forEach(product => {
    sitemap.add(`/products/${product.slug}`, {
      lastmod: product.updatedAt,
      changefreq: 'monthly',
      priority: 0.8,
      images: product.images.map(img => ({
        url: img.url,
        caption: img.alt,
      })),
    });
  });

  return sitemap.toXML();
}
```

## 🛡️ Error Handling

The package provides comprehensive error handling with detailed error messages:

```typescript
import { ValidationError } from '@rumenx/sitemap';

try {
  sitemap.add('invalid-url');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Field:', error.field);
    console.log('Type:', error.type);
    console.log('Message:', error.message);
    console.log('Value:', error.value);
  }
}
```

## 🌟 Migration Guide

### From other sitemap packages

```typescript
// Before (other packages)
const sitemap = require('sitemap');
const urls = [{ url: '/', changefreq: 'daily', priority: 1.0 }];
const sm = sitemap.createSitemap({ urls });

// After (@rumenx/sitemap)
import { Sitemap } from '@rumenx/sitemap';
const sm = new Sitemap();
sm.add('/', { changefreq: 'daily', priority: 1.0 });
```

## 📋 Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 4.5.0 (for TypeScript projects)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/RumenDamyanov/npm-sitemap)
- [npm Package](https://www.npmjs.com/package/@rumenx/sitemap)
- [Issue Tracker](https://github.com/RumenDamyanov/npm-sitemap/issues)
- [Changelog](CHANGELOG.md)

## ⭐ Support

If you find this package helpful, please consider giving it a ⭐ on GitHub!

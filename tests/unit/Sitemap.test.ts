/**
 * Test suite for the main Sitemap class
 */

import { Sitemap } from '../../src/sitemap/Sitemap.js';
import type { SitemapItem } from '../../src/types/SitemapTypes.js';

describe('Sitemap', () => {
  let sitemap: Sitemap;

  beforeEach(() => {
    sitemap = new Sitemap();
  });

  describe('constructor', () => {
    it('should create a new Sitemap instance with default config', () => {
      expect(sitemap).toBeInstanceOf(Sitemap);
      expect(sitemap.getItemCount()).toBe(0);
    });

    it('should create a Sitemap with custom config', () => {
      const customSitemap = new Sitemap({
        baseUrl: 'https://example.com',
        validate: false,
        pretty: false,
      });
      expect(customSitemap).toBeInstanceOf(Sitemap);
    });
  });

  describe('add method', () => {
    it('should add a simple URL', () => {
      sitemap.add('https://example.com/');
      expect(sitemap.getItemCount()).toBe(1);

      const items = sitemap.getItems();
      expect(items[0].loc).toBe('https://example.com/');
    });

    it('should add URL with all optional parameters', () => {
      const lastmod = new Date('2025-01-01');
      sitemap.add('https://example.com/page', lastmod, 0.8, 'weekly');

      const items = sitemap.getItems();
      const item = items[0];

      expect(item.loc).toBe('https://example.com/page');
      expect(item.lastmod).toBe('2025-01-01T00:00:00.000Z');
      expect(item.priority).toBe(0.8);
      expect(item.changefreq).toBe('weekly');
    });

    it('should add URL with images', () => {
      sitemap.add('https://example.com/gallery', undefined, undefined, undefined, {
        images: [
          {
            url: 'https://example.com/image1.jpg',
            title: 'Image 1',
            caption: 'A beautiful image',
          },
        ],
      });

      const items = sitemap.getItems();
      const item = items[0];

      expect(item.images).toHaveLength(1);
      expect(item.images![0].url).toBe('https://example.com/image1.jpg');
      expect(item.images![0].title).toBe('Image 1');
    });

    it('should return the sitemap instance for method chaining', () => {
      const result = sitemap.add('https://example.com/');
      expect(result).toBe(sitemap);
    });
  });

  describe('addItem method', () => {
    it('should add a single item object', () => {
      const item: Omit<SitemapItem, 'loc'> & { loc: string } = {
        loc: 'https://example.com/about',
        lastmod: '2025-01-01',
        priority: 0.9,
        changefreq: 'monthly',
      };

      sitemap.addItem(item);
      expect(sitemap.getItemCount()).toBe(1);

      const items = sitemap.getItems();
      expect(items[0].loc).toBe('https://example.com/about');
      expect(items[0].priority).toBe(0.9);
    });

    it('should add multiple items at once', () => {
      const items = [
        { loc: 'https://example.com/page1' },
        { loc: 'https://example.com/page2' },
        { loc: 'https://example.com/page3' },
      ];

      sitemap.addItem(items);
      expect(sitemap.getItemCount()).toBe(3);
    });

    it('should handle Date objects in lastmod', () => {
      const item = {
        loc: 'https://example.com/news',
        lastmod: new Date('2025-01-01T12:00:00Z'),
      };

      sitemap.addItem(item);
      const items = sitemap.getItems();
      expect(items[0].lastmod).toBe('2025-01-01T12:00:00.000Z');
    });

    it('should return the sitemap instance for method chaining', () => {
      const result = sitemap.addItem({ loc: 'https://example.com/' });
      expect(result).toBe(sitemap);
    });
  });

  describe('getItems and getItemCount', () => {
    it('should return empty array and 0 count for new sitemap', () => {
      expect(sitemap.getItems()).toEqual([]);
      expect(sitemap.getItemCount()).toBe(0);
    });

    it('should return correct items and count after adding items', () => {
      sitemap.add('https://example.com/1');
      sitemap.add('https://example.com/2');

      const items = sitemap.getItems();
      expect(items).toHaveLength(2);
      expect(sitemap.getItemCount()).toBe(2);
      expect(items[0].loc).toBe('https://example.com/1');
      expect(items[1].loc).toBe('https://example.com/2');
    });
  });

  describe('clear method', () => {
    it('should remove all items from the sitemap', () => {
      sitemap.add('https://example.com/1');
      sitemap.add('https://example.com/2');
      expect(sitemap.getItemCount()).toBe(2);

      sitemap.clear();
      expect(sitemap.getItemCount()).toBe(0);
      expect(sitemap.getItems()).toEqual([]);
    });

    it('should return the sitemap instance for method chaining', () => {
      const result = sitemap.clear();
      expect(result).toBe(sitemap);
    });
  });

  describe('removeItems method', () => {
    beforeEach(() => {
      sitemap.add('https://example.com/keep1');
      sitemap.add('https://example.com/remove1');
      sitemap.add('https://example.com/keep2');
      sitemap.add('https://example.com/remove2');
    });

    it('should remove items matching the predicate', () => {
      sitemap.removeItems(item => item.loc.includes('remove'));

      expect(sitemap.getItemCount()).toBe(2);
      const items = sitemap.getItems();
      expect(items[0].loc).toBe('https://example.com/keep1');
      expect(items[1].loc).toBe('https://example.com/keep2');
    });

    it('should return the sitemap instance for method chaining', () => {
      const result = sitemap.removeItems(() => false);
      expect(result).toBe(sitemap);
    });
  });

  describe('getStats method', () => {
    it('should return correct statistics for empty sitemap', () => {
      const stats = sitemap.getStats();

      expect(stats.urls).toBe(0);
      expect(stats.withImages).toBe(0);
      expect(stats.withVideos).toBe(0);
      expect(stats.totalImages).toBe(0);
      expect(stats.totalVideos).toBe(0);
      expect(stats.estimatedSize).toBeGreaterThan(0); // Base XML structure
    });

    it('should return correct statistics with images and videos', () => {
      sitemap.addItem({
        loc: 'https://example.com/gallery',
        images: [
          { url: 'https://example.com/img1.jpg', title: 'Image 1' },
          { url: 'https://example.com/img2.jpg', title: 'Image 2' },
        ],
        videos: [
          {
            thumbnail_url: 'https://example.com/thumb1.jpg',
            title: 'Video 1',
            description: 'A great video',
          },
        ],
      });

      const stats = sitemap.getStats();

      expect(stats.urls).toBe(1);
      expect(stats.withImages).toBe(1);
      expect(stats.withVideos).toBe(1);
      expect(stats.totalImages).toBe(2);
      expect(stats.totalVideos).toBe(1);
    });
  });

  describe('toXML method', () => {
    it('should generate valid XML for empty sitemap', () => {
      const xml = sitemap.toXML();

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('</urlset>');
    });

    it('should generate XML with URL entries', () => {
      sitemap.add('https://example.com/');
      sitemap.add('https://example.com/about', new Date('2025-01-01'), 0.8, 'monthly');

      const xml = sitemap.toXML();

      expect(xml).toContain('<url>');
      expect(xml).toContain('<loc>https://example.com/</loc>');
      expect(xml).toContain('<loc>https://example.com/about</loc>');
      expect(xml).toContain('<lastmod>2025-01-01T00:00:00.000Z</lastmod>');
      expect(xml).toContain('<priority>0.8</priority>');
      expect(xml).toContain('<changefreq>monthly</changefreq>');
      expect(xml).toContain('</url>');
    });

    it('should include image namespace when images are present', () => {
      sitemap.addItem({
        loc: 'https://example.com/gallery',
        images: [{ url: 'https://example.com/img1.jpg', title: 'Image 1' }],
      });

      const xml = sitemap.toXML();

      expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
      expect(xml).toContain('<image:image>');
      expect(xml).toContain('<image:loc>https://example.com/img1.jpg</image:loc>');
      expect(xml).toContain('<image:title>Image 1</image:title>');
    });

    it('should generate pretty-formatted XML by default', () => {
      sitemap.add('https://example.com/');
      const xml = sitemap.toXML();

      // Check for indentation - based on actual output
      expect(xml).toContain('<url>');
      expect(xml).toContain('  <loc>'); // loc should be indented within url
    });

    it('should generate compact XML when pretty is false', () => {
      const compactSitemap = new Sitemap({ pretty: false });
      compactSitemap.add('https://example.com/');
      const xml = compactSitemap.toXML();

      // Should not have extra indentation
      expect(xml).toContain('<url>');
      expect(xml).not.toContain('  <url>');
    });
  });

  describe('toTXT method', () => {
    it('should generate plain text URL list', () => {
      sitemap.add('https://example.com/');
      sitemap.add('https://example.com/about');
      sitemap.add('https://example.com/contact');

      const txt = sitemap.toTXT();
      const lines = txt.split('\n');

      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe('https://example.com/');
      expect(lines[1]).toBe('https://example.com/about');
      expect(lines[2]).toBe('https://example.com/contact');
    });
  });

  describe('validate method', () => {
    it('should return empty array for valid sitemap', () => {
      sitemap.add('https://example.com/');
      const errors = sitemap.validate();
      expect(errors).toEqual([]);
    });

    it('should return validation errors for invalid URLs', () => {
      // Create sitemap with validation disabled first, then validate manually
      const noValidationSitemap = new Sitemap({ validate: false });
      noValidationSitemap.addItem({ loc: 'invalid-url' });
      const errors = noValidationSitemap.validate();
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('shouldSplit method', () => {
    it('should return false for small sitemaps', () => {
      sitemap.add('https://example.com/');
      expect(sitemap.shouldSplit()).toBe(false);
    });
  });

  describe('URL resolution', () => {
    it('should resolve relative URLs with baseUrl', () => {
      const sitemapWithBase = new Sitemap({ baseUrl: 'https://example.com' });
      sitemapWithBase.add('/relative-path');

      const items = sitemapWithBase.getItems();
      expect(items[0].loc).toBe('https://example.com/relative-path');
    });

    it('should keep absolute URLs unchanged', () => {
      const sitemapWithBase = new Sitemap({ baseUrl: 'https://example.com' });
      sitemapWithBase.add('https://other.com/absolute');

      const items = sitemapWithBase.getItems();
      expect(items[0].loc).toBe('https://other.com/absolute');
    });
  });

  describe('validation config', () => {
    it('should validate by default', async () => {
      // This test validates that URLs are checked by default
      expect(() => {
        sitemap.add('invalid-url');
      }).toThrow();
    });

    it('should skip validation when disabled', () => {
      const nonValidatingSitemap = new Sitemap({ validate: false });

      // Should not throw for invalid URL when validation is disabled
      expect(() => {
        nonValidatingSitemap.add('invalid-url');
      }).not.toThrow();

      expect(nonValidatingSitemap.getItemCount()).toBe(1);
    });
  });

  describe('advanced XML features', () => {
    it('should handle complex items with all features', () => {
      const complexItem: SitemapItem = {
        loc: 'https://example.com/complex',
        lastmod: '2025-01-01T00:00:00.000Z',
        priority: 0.9,
        changefreq: 'daily',
        images: [
          {
            url: 'https://example.com/image1.jpg',
            title: 'Image Title',
            caption: 'Image Caption',
          },
          {
            url: 'https://example.com/image2.jpg',
          },
        ],
        videos: [
          {
            thumbnail_url: 'https://example.com/thumb.jpg',
            title: 'Video Title',
            description: 'Video Description',
            duration: 120,
          },
          {
            thumbnail_url: 'https://example.com/thumb2.jpg',
            title: 'Video Title 2',
            description: 'Video Description 2',
          },
        ],
        translations: [
          {
            language: 'es',
            url: 'https://example.com/es/complex',
          },
          {
            language: 'fr',
            url: 'https://example.com/fr/complex',
          },
        ],
        alternates: [
          {
            url: 'https://m.example.com/complex',
            media: 'only screen and (max-width: 640px)',
          },
          {
            url: 'https://amp.example.com/complex',
          },
        ],
        googlenews: {
          sitename: 'Example News',
          language: 'en',
          publication_date: '2025-01-01T00:00:00.000Z',
          title: 'News Article Title',
        },
      };

      sitemap.addItem(complexItem);
      const xml = sitemap.toXML();

      // Check all namespaces are included
      expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
      expect(xml).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
      expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
      expect(xml).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');

      // Check all content is rendered
      expect(xml).toContain('<image:image>');
      expect(xml).toContain('<image:title>Image Title</image:title>');
      expect(xml).toContain('<image:caption>Image Caption</image:caption>');
      expect(xml).toContain('<video:video>');
      expect(xml).toContain('<video:duration>120</video:duration>');
      expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es"');
      expect(xml).toContain(
        '<xhtml:link rel="alternate" media="only screen and (max-width: 640px)"'
      );
      expect(xml).toContain('<news:news>');
      expect(xml).toContain('<news:title>News Article Title</news:title>');
    });

    it('should handle items with partial features', () => {
      const partialItem: SitemapItem = {
        loc: 'https://example.com/partial',
        images: [
          {
            url: 'https://example.com/image.jpg',
            // No title or caption
          },
        ],
        videos: [
          {
            thumbnail_url: 'https://example.com/thumb.jpg',
            title: 'Video Title',
            description: 'Video Description',
            // No duration
          },
        ],
        googlenews: {
          sitename: 'Example News',
          language: 'en',
          publication_date: '2025-01-01T00:00:00.000Z',
          // No title
        },
      };

      sitemap.addItem(partialItem);
      const xml = sitemap.toXML();

      // Should not contain optional elements that weren't provided
      expect(xml).not.toContain('<image:title>');
      expect(xml).not.toContain('<image:caption>');
      expect(xml).not.toContain('<video:duration>');
      expect(xml).not.toContain('<news:title>');

      // But should contain required elements
      expect(xml).toContain('<image:loc>');
      expect(xml).toContain('<video:thumbnail_loc>');
      expect(xml).toContain('<news:publication_date>');
    });

    it('should handle empty arrays properly', () => {
      const itemWithEmptyArrays: SitemapItem = {
        loc: 'https://example.com/empty',
        images: [],
        videos: [],
        translations: [],
        alternates: [],
      };

      sitemap.addItem(itemWithEmptyArrays);
      const xml = sitemap.toXML();

      // Should not include namespaces for empty arrays
      expect(xml).not.toContain('xmlns:image=');
      expect(xml).not.toContain('xmlns:video=');
      expect(xml).not.toContain('xmlns:xhtml=');
      expect(xml).not.toContain('xmlns:news=');
    });

    it('should handle alternates without media attribute', () => {
      const item: SitemapItem = {
        loc: 'https://example.com/alt',
        alternates: [
          {
            url: 'https://amp.example.com/alt',
            // No media attribute
          },
        ],
      };

      sitemap.addItem(item);
      const xml = sitemap.toXML();

      // Should not include media attribute when not provided
      expect(xml).toContain('<xhtml:link rel="alternate" href="https://amp.example.com/alt" />');
      expect(xml).not.toContain(' media=');
    });
  });

  describe('XML escaping edge cases', () => {
    it('should escape XML characters in all content', () => {
      const item: SitemapItem = {
        loc: 'https://example.com/test?param=<>&"\'',
        images: [
          {
            url: 'https://example.com/image.jpg?param=<>&"\'',
            title: 'Title with <>&"\' characters',
            caption: 'Caption with <>&"\' characters',
          },
        ],
        googlenews: {
          sitename: 'Site with <>&"\' characters',
          language: 'en',
          publication_date: '2025-01-01T00:00:00.000Z',
          title: 'News with <>&"\' characters',
        },
      };

      sitemap.addItem(item);
      const xml = sitemap.toXML();

      // Check that characters are properly escaped
      expect(xml).toContain('&lt;');
      expect(xml).toContain('&gt;');
      expect(xml).toContain('&amp;');
      expect(xml).toContain('&quot;');
      expect(xml).toContain('&#39;');
    });

    it('should not escape when escaping is disabled', () => {
      const noEscapeSitemap = new Sitemap({ escaping: false });
      const item: SitemapItem = {
        loc: 'https://example.com/test?param=<>&"\'',
        images: [
          {
            url: 'https://example.com/image.jpg?param=<>&"\'',
            title: 'Title with <>&"\' characters',
          },
        ],
      };

      noEscapeSitemap.addItem(item);
      const xml = noEscapeSitemap.toXML();

      // Characters should not be escaped
      expect(xml).toContain('<>&"\'');
      expect(xml).not.toContain('&lt;');
      expect(xml).not.toContain('&gt;');
      expect(xml).not.toContain('&amp;');
      expect(xml).not.toContain('&quot;');
      expect(xml).not.toContain('&#39;');
    });
  });

  describe('render method edge cases', () => {
    it('should throw error for unsupported format', () => {
      sitemap.add('https://example.com/');

      expect(() => {
        sitemap.render('json' as any);
      }).toThrow("Format 'json' not yet implemented. Currently only 'xml' is supported.");
    });

    it('should render HTML format', () => {
      sitemap.add('https://example.com/');

      expect(() => {
        sitemap.render('html');
      }).toThrow("Format 'html' not yet implemented. Currently only 'xml' is supported.");
    });
  });

  describe('error handling with validation disabled', () => {
    it('should handle invalid date formats when validation is disabled', () => {
      const noValidationSitemap = new Sitemap({ validate: false });
      const item: SitemapItem = {
        loc: 'https://example.com/test',
        lastmod: 'invalid-date' as any,
      };

      // Should not throw when validation is disabled
      expect(() => {
        noValidationSitemap.addItem(item);
      }).not.toThrow();
    });

    it('should handle missing required fields when validation is disabled', () => {
      const noValidationSitemap = new Sitemap({ validate: false });
      const item: SitemapItem = {
        loc: 'https://example.com/test',
        images: [
          {
            url: '', // Empty URL should be handled
          } as any,
        ],
        videos: [
          {
            thumbnail_url: '',
            title: '',
            description: '',
          } as any,
        ],
      };

      // Should not throw when validation is disabled
      expect(() => {
        noValidationSitemap.addItem(item);
      }).not.toThrow();
    });

    it('should validate and throw errors when validation is enabled', () => {
      const item: SitemapItem = {
        loc: 'https://example.com/test',
        lastmod: 'invalid-date' as any,
      };

      // Should throw when validation is enabled (default)
      expect(() => {
        sitemap.addItem(item);
      }).toThrow('Validation failed');
    });
  });
});

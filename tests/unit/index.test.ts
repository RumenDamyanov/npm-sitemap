/**
 * Tests for the main package exports
 */

import * as SitemapPackage from '../../src/index.js';

describe('Package Exports', () => {
  describe('main exports', () => {
    it('should export all main classes', () => {
      expect(SitemapPackage.Sitemap).toBeDefined();
      expect(SitemapPackage.SitemapIndex).toBeDefined();
      expect(SitemapPackage.Model).toBeDefined();
      expect(SitemapPackage.DataValidator).toBeDefined();
    });

    it('should export date utility functions', () => {
      expect(SitemapPackage.formatDate).toBeDefined();
      expect(SitemapPackage.isValidDate).toBeDefined();
      expect(SitemapPackage.parseDate).toBeDefined();
    });

    it('should export XML utility functions', () => {
      expect(SitemapPackage.escapeXml).toBeDefined();
      expect(SitemapPackage.createElement).toBeDefined();
      expect(SitemapPackage.formatXml).toBeDefined();
    });

    it('should export URL validator functions', () => {
      expect(SitemapPackage.isValidUrl).toBeDefined();
      expect(SitemapPackage.normalizeUrl).toBeDefined();
      expect(SitemapPackage.resolveUrl).toBeDefined();
    });
  });

  describe('package metadata', () => {
    it('should export package version', () => {
      expect(SitemapPackage.version).toBe('1.0.0');
      expect(typeof SitemapPackage.version).toBe('string');
    });

    it('should export package name', () => {
      expect(SitemapPackage.name).toBe('@rumenx/sitemap');
      expect(typeof SitemapPackage.name).toBe('string');
    });

    it('should export package info object', () => {
      expect(SitemapPackage.packageInfo).toBeDefined();
      expect(typeof SitemapPackage.packageInfo).toBe('object');
      expect(SitemapPackage.packageInfo.name).toBe('@rumenx/sitemap');
      expect(SitemapPackage.packageInfo.version).toBe('1.0.0');
    });

    it('should freeze package info object', () => {
      expect(Object.isFrozen(SitemapPackage.packageInfo)).toBe(true);
    });
  });

  describe('functional integration', () => {
    it('should be able to create instances from exported classes', () => {
      const sitemap = new SitemapPackage.Sitemap();
      const sitemapIndex = new SitemapPackage.SitemapIndex();
      const model = new SitemapPackage.Model();
      const validator = new SitemapPackage.DataValidator();

      expect(sitemap).toBeInstanceOf(SitemapPackage.Sitemap);
      expect(sitemapIndex).toBeInstanceOf(SitemapPackage.SitemapIndex);
      expect(model).toBeInstanceOf(SitemapPackage.Model);
      expect(validator).toBeInstanceOf(SitemapPackage.DataValidator);
    });

    it('should be able to use exported utility functions', () => {
      const testDate = new Date();
      const formattedDate = SitemapPackage.formatDate(testDate);
      expect(typeof formattedDate).toBe('string');
      expect(SitemapPackage.isValidDate(formattedDate)).toBe(true);

      const escapedXml = SitemapPackage.escapeXml('<test>');
      expect(escapedXml).toBe('&lt;test&gt;');

      const isValid = SitemapPackage.isValidUrl('https://example.com');
      expect(isValid).toBe(true);
    });
  });
});

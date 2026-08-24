# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2026-08-24

### Security

- Escape Google News `language` and `publication_date` when rendering XML, matching the php-sitemap fix for [GHSA-3j73-g385-2pc5](https://github.com/RumenDamyanov/php-sitemap/security/advisories/GHSA-3j73-g385-2pc5).
- Escape `keywords` and `stock_tickers` and include them in Google News output so those typed fields cannot be echoed raw later.

### Fixed

- Google News sitemap items now emit `news:keywords` and `news:stock_tickers` when provided.

### Added

- Initial implementation of comprehensive TypeScript sitemap package
- Full support for XML sitemap generation with images, videos, translations, and Google News
- SitemapIndex class for managing multiple sitemap files
- Advanced URL validation and data sanitization
- Statistics and analytics for sitemap content
- Multiple output formats (XML, TXT, HTML)
- Complete TypeScript type definitions
- Comprehensive test suite with 97%+ coverage
- GitHub Actions CI/CD pipeline
- Dependabot configuration for automated dependency updates

### Features

- Modern ESM/CJS dual package support
- Zero runtime dependencies
- Tree-shakable imports
- Built-in XML escaping and content validation
- Flexible configuration options
- Support for international content (hreflang)
- Mobile and AMP page support
- Rich media metadata support
- Memory efficient processing for large sitemaps

## [1.0.0] - 2025-09-27

### Added

- Initial release of @rumenx/sitemap package
- Complete TypeScript implementation
- Full XML Sitemap Protocol support
- Comprehensive documentation and examples
- Production-ready build system
- Professional-grade test coverage

### Technical Details

- Node.js >= 18.0.0 support
- TypeScript 5.4.2 compatibility
- Jest testing framework with 376+ test cases
- ESLint and Prettier integration
- Automated CI/CD with GitHub Actions
- NPM publishing workflow
- Codecov integration for coverage reporting

[unreleased]: https://github.com/RumenDamyanov/npm-sitemap/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/RumenDamyanov/npm-sitemap/releases/tag/v1.0.3
[1.0.0]: https://github.com/RumenDamyanov/npm-sitemap/releases/tag/v1.0.0

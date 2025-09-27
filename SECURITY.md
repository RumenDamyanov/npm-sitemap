# Security Policy

## Supported Versions

We actively support the following versions of @rumenx/sitemap with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of @rumenx/sitemap seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to: <security@rumenx.com>

Include the following information in your report:

- Type of issue (buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including potential ways an attacker might exploit it

### What to Expect

You should receive a response from us within **48 hours**. If the issue is confirmed as a vulnerability, we will:

1. Acknowledge your email within 48 hours
2. Confirm the problem and determine affected versions
3. Audit code to find similar problems
4. Prepare fixes for all supported versions
5. Release patched versions as quickly as possible
6. Publicly disclose the vulnerability details after fixes are available

## Security Considerations for Users

### Input Validation

While @rumenx/sitemap includes built-in validation, please consider these security best practices:

#### URL Validation

```typescript
// The package validates URLs, but always sanitize user input
const sitemap = new Sitemap({
  validate: true, // Enable built-in validation
  allowedDomains: ['yourdomain.com'], // Restrict to trusted domains
});

// Avoid directly passing user input without validation
const userUrl = sanitizeUrl(userInput); // Use your own validation
sitemap.add(userUrl);
```

#### Content Escaping

```typescript
// XML content is automatically escaped by default
const sitemap = new Sitemap({
  escapeContent: true, // Default: true - keeps content safe
});

// When disabling escaping, ensure content is already safe
const sitemap = new Sitemap({
  escapeContent: false, // Only use if you pre-validate content
});
```

### File System Security

When writing sitemap files:

```typescript
// ✅ Good: Use safe, validated paths
const safePath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(safePath, sitemap.toXML());

// ❌ Avoid: Direct user input in file paths
// fs.writeFileSync(userProvidedPath, sitemap.toXML()); // Potential path traversal
```

### Server-Side Usage

When serving sitemaps dynamically:

```typescript
app.get('/sitemap.xml', (req, res) => {
  // Set appropriate security headers
  res.set({
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  });

  // Use validated configuration
  const sitemap = new Sitemap({
    validate: true,
    allowedDomains: ['yourdomain.com'],
  });

  res.send(sitemap.toXML());
});
```

## Common Vulnerabilities Mitigated

### XML External Entity (XXE) Prevention

- The package generates XML output only
- No XML parsing of external input
- All content is properly escaped by default

### URL Injection Prevention

- Built-in URL validation using Node.js URL constructor
- Support for domain allowlists
- Automatic protocol validation (HTTP/HTTPS only)

### Content Injection Prevention

- Automatic XML entity escaping
- CDATA wrapping for problematic content
- Validation of all input parameters

## Dependency Security

We maintain security through:

- **Zero runtime dependencies** - Eliminates third-party security risks
- **Regular dependency audits** - Dev dependencies are regularly updated
- **Automated security scanning** - GitHub Dependabot alerts enabled
- **CI/CD security checks** - Automated vulnerability scanning in workflows

## Security Updates

Security updates will be:

- Released as patch versions (e.g., 1.0.1, 1.0.2)
- Documented in [CHANGELOG.md](CHANGELOG.md)
- Announced through GitHub releases
- Tagged with security labels

## Responsible Disclosure Timeline

- **Day 0**: Vulnerability reported privately
- **Day 1-2**: Initial response and acknowledgment
- **Day 3-7**: Vulnerability assessment and reproduction
- **Day 8-14**: Fix development and testing
- **Day 15-21**: Release preparation and distribution
- **Day 22+**: Public disclosure with fix available

## Bug Bounty Program

Currently, we do not operate a bug bounty program. However, we deeply appreciate security researchers who responsibly disclose vulnerabilities and will publicly acknowledge their contributions (with permission).

## Additional Resources

- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Guidelines](https://docs.npmjs.com/security)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

## Contact Information

- **Security Email**: <security@rumenx.com>
- **General Contact**: <contact@rumenx.com>
- **GitHub Issues**: [Issues Page](https://github.com/RumenDamyanov/npm-sitemap/issues) (for non-security bugs only)

---

_This security policy is effective as of September 2025 and may be updated periodically._

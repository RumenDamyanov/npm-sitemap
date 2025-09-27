/**
 * XML utility functions for sitemap generation
 *
 * This module provides utilities for XML generation, escaping, and formatting.
 */

/**
 * Escape special XML characters in text content
 *
 * @param text - Text to escape
 * @returns Escaped text safe for XML
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Wrap text in CDATA section if it contains problematic characters
 *
 * @param text - Text to potentially wrap
 * @returns CDATA wrapped text or original text
 */
export function wrapCDATA(text: string): string {
  // Check if text contains characters that benefit from CDATA
  if (text.includes('&') || text.includes('<') || text.includes('>') || text.includes('\n')) {
    // Escape any existing ]]> sequences in the text
    const escapedText = text.replace(/]]>/g, ']]&gt;');
    return `<![CDATA[${escapedText}]]>`;
  }
  return escapeXml(text);
}

/**
 * Generate XML declaration
 *
 * @param version - XML version (default: '1.0')
 * @param encoding - Character encoding (default: 'UTF-8')
 * @returns XML declaration string
 */
export function xmlDeclaration(version = '1.0', encoding = 'UTF-8'): string {
  return `<?xml version="${version}" encoding="${encoding}"?>`;
}

/**
 * Generate XML stylesheet processing instruction
 *
 * @param href - Stylesheet URL
 * @param type - MIME type (default: 'text/xsl')
 * @returns Stylesheet processing instruction
 */
export function xmlStylesheet(href: string, type = 'text/xsl'): string {
  return `<?xml-stylesheet href="${escapeXml(href)}" type="${type}"?>`;
}

/**
 * Create an XML element with text content
 *
 * @param tagName - Name of the XML element
 * @param content - Text content of the element
 * @param attributes - Optional attributes as key-value pairs
 * @param indent - Indentation level for pretty formatting
 * @returns XML element string
 */
export function createElement(
  tagName: string,
  content?: string,
  attributes?: Record<string, string>,
  indent = 0
): string {
  const indentStr = '  '.repeat(indent);
  const attrStr = attributes
    ? Object.entries(attributes)
        .map(([key, value]) => ` ${key}="${escapeXml(value)}"`)
        .join('')
    : '';

  if (content === undefined || content === '') {
    return `${indentStr}<${tagName}${attrStr} />`;
  }

  const escapedContent = escapeXml(content);
  return `${indentStr}<${tagName}${attrStr}>${escapedContent}</${tagName}>`;
}

/**
 * Create an XML element with child elements
 *
 * @param tagName - Name of the XML element
 * @param children - Array of child element strings
 * @param attributes - Optional attributes as key-value pairs
 * @param indent - Indentation level for pretty formatting
 * @returns XML element string with children
 */
export function createElementWithChildren(
  tagName: string,
  children: string[],
  attributes?: Record<string, string>,
  indent = 0
): string {
  const indentStr = '  '.repeat(indent);
  const attrStr = attributes
    ? Object.entries(attributes)
        .map(([key, value]) => ` ${key}="${escapeXml(value)}"`)
        .join('')
    : '';

  if (children.length === 0) {
    return `${indentStr}<${tagName}${attrStr} />`;
  }

  const childrenStr = children.join('\n');
  return `${indentStr}<${tagName}${attrStr}>\n${childrenStr}\n${indentStr}</${tagName}>`;
}

/**
 * Format XML with proper indentation
 *
 * @param xml - Raw XML string
 * @param indent - Indentation string (default: '  ')
 * @returns Formatted XML string
 */
export function formatXml(xml: string, indent = '  '): string {
  let formatted = '';
  let level = 0;
  const lines = xml.split(/>\s*</);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line) continue;

    if (i > 0) {
      formatted += '<';
    }

    if (line.match(/^\/\w/)) {
      level--;
    }

    formatted += indent.repeat(level) + line;

    if (i < lines.length - 1) {
      formatted += i === 0 ? '>' : '>\n';
    }

    if (line.match(/^<?\w[^>]*[^\/]$/)) {
      level++;
    }
  }

  return formatted;
}

/**
 * Validate XML namespace declarations
 *
 * @param namespaces - Namespace declarations as key-value pairs
 * @returns Validated namespace attributes string
 */
export function createNamespaceDeclarations(namespaces: Record<string, string>): string {
  return Object.entries(namespaces)
    .map(([prefix, uri]) => {
      const nsPrefix = prefix === 'default' || prefix === 'sitemap' ? 'xmlns' : `xmlns:${prefix}`;
      return ` ${nsPrefix}="${escapeXml(uri)}"`;
    })
    .join('');
}

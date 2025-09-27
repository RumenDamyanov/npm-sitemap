/**
 * Data validation utilities for sitemap items
 *
 * This module provides comprehensive validation for sitemap item data
 * including priority values, dates, and structured content.
 */

import type {
  SitemapItem,
  SitemapIndexItem,
  ValidationError,
  ChangeFrequency,
  ImageItem,
  VideoItem,
  TranslationItem,
  AlternateItem,
  GoogleNewsItem,
} from '../types/SitemapTypes.js';
import type { IValidator } from '../interfaces/index.js';
import { isValidUrl } from './UrlValidator.js';
import { isValidDate, isValidLastModDate } from '../utils/DateUtils.js';

/**
 * Valid change frequency values
 */
const VALID_FREQUENCIES: ChangeFrequency[] = [
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
];

/**
 * Data validator implementation
 */
export class DataValidator implements IValidator {
  /**
   * Validate a URL
   *
   * @param url - URL to validate
   * @returns True if valid
   */
  isValidUrl(url: string): boolean {
    return isValidUrl(url);
  }

  /**
   * Validate a priority value
   *
   * @param priority - Priority to validate
   * @returns True if valid
   */
  isValidPriority(priority: number): boolean {
    return typeof priority === 'number' && priority >= 0.0 && priority <= 1.0 && !isNaN(priority);
  }

  /**
   * Validate a date
   *
   * @param date - Date to validate
   * @returns True if valid
   */
  isValidDate(date: string | Date): boolean {
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    return isValidDate(date);
  }

  /**
   * Validate a change frequency value
   *
   * @param freq - Frequency to validate
   * @returns True if valid
   */
  isValidChangeFreq(freq: string): freq is ChangeFrequency {
    return VALID_FREQUENCIES.includes(freq as ChangeFrequency);
  }

  /**
   * Validate an image item
   *
   * @param image - Image item to validate
   * @returns Array of validation errors
   */
  validateImageItem(image: ImageItem): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!image.url) {
      errors.push({
        type: 'required',
        field: 'image.url',
        message: 'Image URL is required',
        value: image.url,
      });
    } else if (!this.isValidUrl(image.url)) {
      errors.push({
        type: 'url',
        field: 'image.url',
        message: 'Image URL is not valid',
        value: image.url,
      });
    }

    return errors;
  }

  /**
   * Validate a video item
   *
   * @param video - Video item to validate
   * @returns Array of validation errors
   */
  validateVideoItem(video: VideoItem): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!video.title) {
      errors.push({
        type: 'required',
        field: 'video.title',
        message: 'Video title is required',
        value: video.title,
      });
    }

    if (!video.description) {
      errors.push({
        type: 'required',
        field: 'video.description',
        message: 'Video description is required',
        value: video.description,
      });
    }

    if (!video.thumbnail_url) {
      errors.push({
        type: 'required',
        field: 'video.thumbnail_url',
        message: 'Video thumbnail URL is required',
        value: video.thumbnail_url,
      });
    } else if (!this.isValidUrl(video.thumbnail_url)) {
      errors.push({
        type: 'url',
        field: 'video.thumbnail_url',
        message: 'Video thumbnail URL is not valid',
        value: video.thumbnail_url,
      });
    }

    // Optional fields validation
    if (video.duration !== undefined && (video.duration < 0 || !Number.isInteger(video.duration))) {
      errors.push({
        type: 'format',
        field: 'video.duration',
        message: 'Video duration must be a positive integer (seconds)',
        value: video.duration,
      });
    }

    if (video.rating !== undefined && (video.rating < 0 || video.rating > 5)) {
      errors.push({
        type: 'format',
        field: 'video.rating',
        message: 'Video rating must be between 0.0 and 5.0',
        value: video.rating,
      });
    }

    return errors;
  }

  /**
   * Validate a translation item
   *
   * @param translation - Translation item to validate
   * @returns Array of validation errors
   */
  validateTranslationItem(translation: TranslationItem): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!translation.language) {
      errors.push({
        type: 'required',
        field: 'translation.language',
        message: 'Translation language is required',
        value: translation.language,
      });
    }

    if (!translation.url) {
      errors.push({
        type: 'required',
        field: 'translation.url',
        message: 'Translation URL is required',
        value: translation.url,
      });
    } else if (!this.isValidUrl(translation.url)) {
      errors.push({
        type: 'url',
        field: 'translation.url',
        message: 'Translation URL is not valid',
        value: translation.url,
      });
    }

    return errors;
  }

  /**
   * Validate an alternate item
   *
   * @param alternate - Alternate item to validate
   * @returns Array of validation errors
   */
  validateAlternateItem(alternate: AlternateItem): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!alternate.url) {
      errors.push({
        type: 'required',
        field: 'alternate.url',
        message: 'Alternate URL is required',
        value: alternate.url,
      });
    } else if (!this.isValidUrl(alternate.url)) {
      errors.push({
        type: 'url',
        field: 'alternate.url',
        message: 'Alternate URL is not valid',
        value: alternate.url,
      });
    }

    return errors;
  }

  /**
   * Validate a Google News item
   *
   * @param news - Google News item to validate
   * @returns Array of validation errors
   */
  validateGoogleNewsItem(news: GoogleNewsItem): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!news.sitename) {
      errors.push({
        type: 'required',
        field: 'googlenews.sitename',
        message: 'Google News sitename is required',
        value: news.sitename,
      });
    }

    if (!news.language) {
      errors.push({
        type: 'required',
        field: 'googlenews.language',
        message: 'Google News language is required',
        value: news.language,
      });
    }

    if (!news.publication_date) {
      errors.push({
        type: 'required',
        field: 'googlenews.publication_date',
        message: 'Google News publication date is required',
        value: news.publication_date,
      });
    } else if (!this.isValidDate(news.publication_date)) {
      errors.push({
        type: 'date',
        field: 'googlenews.publication_date',
        message: 'Google News publication date is not valid',
        value: news.publication_date,
      });
    }

    return errors;
  }

  /**
   * Validate a complete sitemap item
   *
   * @param item - Item to validate
   * @returns Array of validation errors
   */
  validateItem(item: SitemapItem): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate required URL
    if (!item.loc) {
      errors.push({
        type: 'required',
        field: 'loc',
        message: 'URL (loc) is required',
        value: item.loc,
      });
    } else if (!this.isValidUrl(item.loc)) {
      errors.push({
        type: 'url',
        field: 'loc',
        message: 'URL (loc) is not valid',
        value: item.loc,
      });
    }

    // Validate optional priority
    if (item.priority !== undefined && !this.isValidPriority(item.priority)) {
      errors.push({
        type: 'priority',
        field: 'priority',
        message: 'Priority must be a number between 0.0 and 1.0',
        value: item.priority,
      });
    }

    // Validate optional lastmod
    if (item.lastmod !== undefined) {
      if (!this.isValidDate(item.lastmod)) {
        errors.push({
          type: 'date',
          field: 'lastmod',
          message: 'Last modification date is not valid',
          value: item.lastmod,
        });
      } else if (!isValidLastModDate(item.lastmod)) {
        errors.push({
          type: 'date',
          field: 'lastmod',
          message: 'Last modification date cannot be in the future',
          value: item.lastmod,
        });
      }
    }

    // Validate optional changefreq
    if (item.changefreq !== undefined && !this.isValidChangeFreq(item.changefreq)) {
      errors.push({
        type: 'format',
        field: 'changefreq',
        message: `Change frequency must be one of: ${VALID_FREQUENCIES.join(', ')}`,
        value: item.changefreq,
      });
    }

    // Validate nested items
    if (item.images) {
      item.images.forEach((image, index) => {
        const imageErrors = this.validateImageItem(image);
        errors.push(
          ...imageErrors.map(error => ({
            ...error,
            field: `images[${index}].${error.field}`,
          }))
        );
      });
    }

    if (item.videos) {
      item.videos.forEach((video, index) => {
        const videoErrors = this.validateVideoItem(video);
        errors.push(
          ...videoErrors.map(error => ({
            ...error,
            field: `videos[${index}].${error.field}`,
          }))
        );
      });
    }

    if (item.translations) {
      item.translations.forEach((translation, index) => {
        const translationErrors = this.validateTranslationItem(translation);
        errors.push(
          ...translationErrors.map(error => ({
            ...error,
            field: `translations[${index}].${error.field}`,
          }))
        );
      });
    }

    if (item.alternates) {
      item.alternates.forEach((alternate, index) => {
        const alternateErrors = this.validateAlternateItem(alternate);
        errors.push(
          ...alternateErrors.map(error => ({
            ...error,
            field: `alternates[${index}].${error.field}`,
          }))
        );
      });
    }

    if (item.googlenews) {
      const newsErrors = this.validateGoogleNewsItem(item.googlenews);
      errors.push(...newsErrors);
    }

    return errors;
  }

  /**
   * Validate a sitemap index item
   *
   * @param item - Index item to validate
   * @returns Array of validation errors
   */
  validateIndexItem(item: SitemapIndexItem): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!item.loc) {
      errors.push({
        type: 'required',
        field: 'loc',
        message: 'Sitemap URL (loc) is required',
        value: item.loc,
      });
    } else if (!this.isValidUrl(item.loc)) {
      errors.push({
        type: 'url',
        field: 'loc',
        message: 'Sitemap URL (loc) is not valid',
        value: item.loc,
      });
    }

    if (item.lastmod !== undefined && !this.isValidDate(item.lastmod)) {
      errors.push({
        type: 'date',
        field: 'lastmod',
        message: 'Last modification date is not valid',
        value: item.lastmod,
      });
    }

    return errors;
  }
}

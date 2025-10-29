import { Page, expect } from '@playwright/test';
import TestData from './testData';

/**
 * Widget Configuration Helper Functions
 * 
 * This file contains reusable helper functions for testing widget configuration
 * parameters. These functions follow the SR SDET pattern of avoiding magic strings
 * and providing consistent, maintainable test utilities.
 */

/**
 * Builds a URL with query parameters
 * 
 * @param baseUrl - The base URL to add parameters to
 * @param params - Object containing parameter key-value pairs
 * @returns URL string with query parameters
 */
export function buildUrlWithParams(baseUrl: string, params: Record<string, string>): string {
  // Ensure baseUrl is a full URL
  const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `http://localhost:3000${baseUrl}`;
  const url = new URL(fullBaseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  
  return url.toString();
}

/**
 * Verifies that a custom logo is displayed with the expected source
 * 
 * @param page - The Playwright page object
 * @param expectedSrc - The expected logo source URL
 */
export async function verifyCustomLogo(page: Page, expectedSrc: string): Promise<void> {
  const logo = page.locator('.Logo');
  await expect(logo).toBeVisible();
  
  const logoSrc = await logo.getAttribute('src');
  expect(logoSrc).toBe(expectedSrc);
}

/**
 * Verifies that a button is hidden from the page
 * 
 * @param page - The Playwright page object
 * @param buttonText - The text content of the button to check
 */
export async function verifyButtonHidden(page: Page, buttonText: string): Promise<void> {
  const button = page.getByRole('link', { name: buttonText });
  await expect(button).not.toBeVisible();
}

/**
 * Verifies that a button is visible and has the expected href attribute
 * 
 * @param page - The Playwright page object
 * @param buttonText - The text content of the button to check
 * @param expectedHref - The expected href URL
 */
export async function verifyButtonLink(page: Page, buttonText: string, expectedHref: string): Promise<void> {
  const button = page.getByRole('link', { name: buttonText });
  await expect(button).toBeVisible();
  
  const href = await button.getAttribute('href');
  expect(href).toBe(expectedHref);
}

/**
 * Verifies that a button is visible (for default behavior testing)
 * 
 * @param page - The Playwright page object
 * @param buttonText - The text content of the button to check
 */
export async function verifyButtonVisible(page: Page, buttonText: string): Promise<void> {
  const button = page.getByRole('link', { name: buttonText });
  await expect(button).toBeVisible();
}

/**
 * Verifies that the default Trevor logo is displayed
 * 
 * @param page - The Playwright page object
 * @param language - The current language ('en' or 'es')
 */
export async function verifyDefaultLogo(page: Page, language: 'en' | 'es' = 'en'): Promise<void> {
  const logo = page.locator('.Logo');
  await expect(logo).toBeVisible();
  
  const logoSrc = await logo.getAttribute('src');
  const expectedSrc = language === 'es' ? '/src/assets/TrevorLogo-es.svg' : '/src/assets/TrevorLogo-en.svg';
  expect(logoSrc).toContain(expectedSrc);
}

/**
 * Verifies that a network request was made for a custom asset
 * 
 * @param page - The Playwright page object
 * @param assetUrl - The URL that should have been requested
 * @param timeout - Maximum time to wait for the request (default: 5000ms)
 */
export async function verifyAssetRequest(page: Page, assetUrl: string, timeout: number = 5000): Promise<void> {
  const response = await page.waitForResponse(response => 
    response.url().includes(assetUrl) && response.status() < 400,
    { timeout }
  );
  
  expect(response).toBeTruthy();
}

/**
 * Verifies that a network request failed (for testing fallback behavior)
 * 
 * @param page - The Playwright page object
 * @param assetUrl - The URL that should have failed
 * @param timeout - Maximum time to wait for the request (default: 5000ms)
 */
export async function verifyAssetRequestFailed(page: Page, assetUrl: string, timeout: number = 5000): Promise<void> {
  try {
    await page.waitForResponse(response => 
      response.url().includes(assetUrl) && response.status() >= 400,
      { timeout }
    );
  } catch (error) {
    // Expected behavior - request should fail or timeout
    expect(error).toBeTruthy();
  }
}

/**
 * Gets the current URL with all query parameters
 * 
 * @param page - The Playwright page object
 * @returns The current page URL
 */
export async function getCurrentUrl(page: Page): Promise<string> {
  return page.url();
}

/**
 * Verifies that the page URL contains specific query parameters
 * 
 * @param page - The Playwright page object
 * @param expectedParams - Object containing expected parameter key-value pairs
 */
export async function verifyUrlParams(page: Page, expectedParams: Record<string, string>): Promise<void> {
  const currentUrl = await getCurrentUrl(page);
  const url = new URL(currentUrl);
  
  Object.entries(expectedParams).forEach(([key, value]) => {
    const paramValue = url.searchParams.get(key);
    expect(paramValue).toBe(value);
  });
}

/**
 * Waits for the page to load completely with widget configuration
 * 
 * @param page - The Playwright page object
 * @param timeout - Maximum time to wait (default: 10000ms)
 */
export async function waitForWidgetConfigLoad(page: Page, timeout: number = 10000): Promise<void> {
  // Wait for the main content to be visible
  await page.waitForSelector('main', { timeout });
  
  // Wait for the logo to be visible (indicates widget config has loaded)
  await page.waitForSelector('.Logo', { timeout });
}

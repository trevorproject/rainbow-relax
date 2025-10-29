import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from './HomePage';
import TestData from '../fixtures/testData';
import { buildUrlWithParams } from '../fixtures/widgetConfigHelpers';

/**
 * Widget Configuration Page Object Model
 * 
 * This class extends HomePage with widget-specific functionality for testing
 * query parameters and widget configuration features.
 * 
 * Benefits:
 * - Reusable across multiple widget configuration tests
 * - Centralized widget-specific locators and actions
 * - Easier maintenance when widget UI changes
 * - Better readability in test files
 */
export class WidgetConfigPage extends HomePage {
  // Widget-specific locators
  readonly donateButton: Locator;
  readonly helpButton: Locator;
  readonly homeButton: Locator;
  readonly logoImage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Widget-specific locators
    this.donateButton = page.getByRole('link', { name: /donate|donar/i });
    this.helpButton = page.getByRole('link', { name: /help|ayuda/i });
    this.homeButton = page.locator('.Logo').first();
    this.logoImage = page.locator('.Logo');
  }

  /**
   * Navigate to the homepage with specific query parameters
   * 
   * @param params - Object containing query parameters to add to the URL
   */
  async gotoWithParams(params: Record<string, string>): Promise<void> {
    const url = buildUrlWithParams(TestData.urls.homepage, params);
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get the current source URL of the logo image
   * 
   * @returns The logo source URL or null if not found
   */
  async getLogoSrc(): Promise<string | null> {
    const logo = this.page.locator('.Logo img');
    if (await logo.count() > 0) {
      return await logo.getAttribute('src');
    }
    return null;
  }

  /**
   * Check if the donate button is visible on the page
   * 
   * @returns True if donate button is visible, false otherwise
   */
  async isDonateButtonVisible(): Promise<boolean> {
    return await this.donateButton.isVisible();
  }

  /**
   * Check if the help button is visible on the page
   * 
   * @returns True if help button is visible, false otherwise
   */
  async isHelpButtonVisible(): Promise<boolean> {
    return await this.helpButton.isVisible();
  }

  /**
   * Get the href attribute of the donate button
   * 
   * @returns The donate button href URL or null if not found
   */
  async getDonateButtonHref(): Promise<string | null> {
    if (await this.isDonateButtonVisible()) {
      return await this.donateButton.getAttribute('href');
    }
    return null;
  }

  /**
   * Get the href attribute of the help button
   * 
   * @returns The help button href URL or null if not found
   */
  async getHelpButtonHref(): Promise<string | null> {
    if (await this.isHelpButtonVisible()) {
      return await this.helpButton.getAttribute('href');
    }
    return null;
  }

  /**
   * Click the home button (logo) to test home URL functionality
   */
  async clickHomeButton(): Promise<void> {
    await this.homeButton.click();
  }

  /**
   * Get the current page URL with all query parameters
   * 
   * @returns The current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify that specific query parameters are present in the URL
   * 
   * @param expectedParams - Object containing expected parameter key-value pairs
   */
  async verifyUrlParams(expectedParams: Record<string, string>): Promise<void> {
    const currentUrl = await this.getCurrentUrl();
    const url = new URL(currentUrl);
    
    Object.entries(expectedParams).forEach(([key, value]) => {
      const paramValue = url.searchParams.get(key);
      expect(paramValue).toBe(value);
    });
  }

  /**
   * Wait for the widget configuration to load completely
   * 
   * @param timeout - Maximum time to wait (default: 10000ms)
   */
  async waitForWidgetConfigLoad(timeout: number = 10000): Promise<void> {
    // Wait for the main content to be visible
    await this.page.waitForSelector('main', { timeout });
    
    // Wait for the logo to be visible (indicates widget config has loaded)
    await this.page.waitForSelector('.Logo', { timeout });
  }

  /**
   * Check if the logo is using a custom URL (not the default Trevor logo)
   * 
   * @returns True if logo is using a custom URL, false otherwise
   */
  async isUsingCustomLogo(): Promise<boolean> {
    const logoSrc = await this.getLogoSrc();
    if (!logoSrc) return false;
    
    // Check if it's not the default Trevor logo paths
    const isDefaultEn = logoSrc.includes('TrevorLogo-en.svg');
    const isDefaultEs = logoSrc.includes('TrevorLogo-es.svg');
    
    return !isDefaultEn && !isDefaultEs;
  }

  /**
   * Get the language-specific donate button text
   * 
   * @param language - The language to get the text for ('en' or 'es')
   * @returns The donate button text for the specified language
   */
  getDonateButtonText(language: 'en' | 'es'): string {
    return language === 'es' ? 'Donar' : 'Donate';
  }

  /**
   * Get the language-specific help button text
   * 
   * @param language - The language to get the text for ('en' or 'es')
   * @returns The help button text for the specified language
   */
  getHelpButtonText(language: 'en' | 'es'): string {
    return language === 'es' ? 'Ayuda' : 'Help';
  }

  /**
   * Verify that both donate and help buttons are visible
   */
  async verifyBothButtonsVisible(): Promise<void> {
    await expect(this.donateButton).toBeVisible();
    await expect(this.helpButton).toBeVisible();
  }

  /**
   * Verify that both donate and help buttons are hidden
   */
  async verifyBothButtonsHidden(): Promise<void> {
    await expect(this.donateButton).not.toBeVisible();
    await expect(this.helpButton).not.toBeVisible();
  }

  /**
   * Verify that only the donate button is hidden
   */
  async verifyOnlyDonateButtonHidden(): Promise<void> {
    await expect(this.donateButton).not.toBeVisible();
    await expect(this.helpButton).toBeVisible();
  }

  /**
   * Verify that only the help button is hidden
   */
  async verifyOnlyHelpButtonHidden(): Promise<void> {
    await expect(this.donateButton).toBeVisible();
    await expect(this.helpButton).not.toBeVisible();
  }
}

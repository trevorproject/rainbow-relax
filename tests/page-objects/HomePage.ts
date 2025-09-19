import { Locator, Page } from '@playwright/test';
import TestData from '../fixtures/testData';

/**
 * Page Object Model for the Homepage
 * This class encapsulates all the homepage-specific locators and actions
 * 
 * Benefits:
 * - Reusable across multiple test files
 * - Centralized element selectors
 * - Easier maintenance when UI changes
 * - Better readability in test files
 */
export class HomePage {
  readonly page: Page;
  
  // Page elements
  readonly startButton: Locator;
  readonly welcomeText: Locator;
  readonly languageToggle: Locator;
  readonly quickEscape: Locator;
  readonly header: Locator;
  readonly navigation: Locator;
  readonly mainContent: Locator;
  readonly donateUrl: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators using TestData selectors
    this.startButton = page.locator(TestData.selectors.startButton);
    this.welcomeText = page.locator(TestData.selectors.welcomeText);
    this.languageToggle = page.locator(TestData.selectors.languageToggle);
    this.quickEscape = page.locator(TestData.selectors.quickEscape);
    
    // Common page elements
    this.header = page.locator('header');
    this.navigation = page.locator('nav');
    this.mainContent = page.locator('main');
    this.donateUrl = page.locator('donateUrl');

  }

  /**
   * Navigate to the homepage
   */
  async goto() {
    await this.page.goto(TestData.urls.homepage);
  }

  /**
   * Start the breathing exercise
   */
  async startBreathingExercise() {
    await this.startButton.click();
  }

  /**
   * Switch language to Spanish
   */
  async switchToSpanish() {
    await this.page.click('[data-testid="spanish-flag"]');
  }

  /**
   * Switch language to English
   */
  async switchToEnglish() {
    await this.page.click('[data-testid="english-flag"]');
  }

  /**
   * Trigger quick escape
   */
  async triggerQuickEscape() {
    await this.quickEscape.click();
  }

  /**
   * Trigger Donate Button
   */
  async triggerdonateButton() {
    await this.donateUrl.click();
  }

  /**
   * Check if the page has loaded correctly
   * More forgiving check that works with current app structure
   */
  async isLoaded() {
    // Just check if main content is visible - that's the most reliable indicator
    return await this.mainContent.isVisible();
  }

  /**
   * Get the current welcome text
   */
  async getWelcomeText() {
    return await this.welcomeText.textContent();
  }

  /**
   * Check if start button is available
   */
  async hasStartButton() {
    return await this.startButton.isVisible();
  }

  /**
   * Check if language toggle is available
   */
  async hasLanguageToggle() {
    return await this.languageToggle.isVisible();
  }

  /**
   * Check if quick escape is available
   */
  async hasQuickEscape() {
    return await this.quickEscape.isVisible();
  }
}

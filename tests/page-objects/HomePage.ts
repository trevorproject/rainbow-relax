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
  
  // Language elements
  readonly languageToggleBase: Locator;
  // Page elements
  readonly startButton: Locator;
  readonly welcomeText: Locator;
  readonly languageToggle: Locator;
  readonly quickEscape: Locator;
  readonly header: Locator;
  readonly navigation: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Language controls
    this.languageToggleBase = page.locator(TestData.selectors.languageToggle);    

    // Initialize locators using TestData selectors
    this.startButton = page.locator(TestData.selectors.startButton);
    this.welcomeText = page.locator(TestData.selectors.welcomeText);
    this.languageToggle = page.locator(TestData.selectors.languageToggle);
    this.quickEscape = page.locator(TestData.selectors.quickEscape);
    
    // Common page elements
    this.header = page.locator('header');
    this.navigation = page.locator('nav');
    this.mainContent = page.locator('main');
  }


    // Get Toggle by language
  getLanguageToggle(lang: 'EN' | 'ES') {
    const re = lang === 'EN' ? /^En$/i : /^Es$/i;
    return this.page.getByRole('button', { name: re });
  }

  private toggleButton() {
  return this.page.getByRole('button', { name: /^(En|Es)$/i });
}
  /**
   * Navigate to the homepage
   */
  async goto() {
    await this.page.goto(TestData.urls.homepage);
  }

  /**
  * Change language
  */
  async switchLanguage(target: 'EN' | 'ES') {
    if (await this.getLanguageToggle(target).isVisible()) return;
    await this.toggleButton().click();
    await this.getLanguageToggle(target).waitFor({ state: 'visible' });
  }
  
  async hasLanguageToggle() {
    return await this.languageToggleBase.isVisible();
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
   * Check if quick escape is available
   */
  async hasQuickEscape() {
    return await this.quickEscape.isVisible();
  }
}

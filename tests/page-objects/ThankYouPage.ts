import { Locator, Page } from '@playwright/test';
import TestData from '../fixtures/testData';

/**
 * Page Object Model for the Thank You page
 * This class encapsulates all the Thank you page-specific locators and actions

 */

export class ThankYouPage {
  readonly page: Page;

   // Page elements
  readonly tryAgain: Locator;
  readonly getHelpUrl: Locator;
  readonly donateUrl: Locator;
  readonly lang: Locator;
  readonly affirmativemessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators using TestData selectors
    this.tryAgain = page.locator(TestData.selectors.tryAgain);
    this.affirmativemessage = page.locator('[data-testid="affirmation-message"]');
    this.getHelpUrl = page.locator(TestData.selectors.getHelpUrl);
    this.donateUrl = page.locator(TestData.selectors.donateUrl);
    
    this.lang = page.locator('lang');
}
/**
   * Navigate to the thank you page
   */
  async goto() {
    // Navigate to the base URL first to establish a context for localStorage
    await this.page.goto(TestData.urls.homepage);
    
    // Set consent in localStorage to avoid redirect to /consent
    await this.page.evaluate(() => {
      localStorage.setItem('hasConsented', 'true');
    });
    
    // Now navigate to the thank you page
    await this.page.goto(TestData.urls.thankyoupage);
    
    // Wait for h1[data-testid="affirmation-message"] to be attached (always present in DOM)
    await this.page.waitForSelector('h1[data-testid="affirmation-message"]', { timeout: 10000, state: 'attached' });
    
    // Optionally wait for affirmation message to have text content (non-blocking)
    try {
      await this.page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="affirmation-message"]');
          return element && element.textContent && element.textContent.trim().length > 0;
        },
        { timeout: 5000 }
      );
    } catch {
      // Message content may still be loading, but element is present - continue
    }
  }
  async hastryAgainButton() {
    return await this.tryAgain.isVisible();
  }
  async getHelpUrlButton() {
    return await this.getHelpUrl.isVisible();
  }
  async donateUrlButton() {
    return await this.donateUrl.isVisible();
  }
  

}


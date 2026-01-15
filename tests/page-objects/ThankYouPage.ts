import { Locator, Page, expect } from '@playwright/test';
import TestData from '../fixtures/testData';

export class ThankYouPage {
  readonly page: Page;
  readonly tryAgain: Locator;
  readonly getHelpUrl: Locator;
  readonly donateUrl: Locator;
  readonly lang: Locator;
  readonly affirmativemessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tryAgain = page.locator(TestData.selectors.tryAgain);
    this.affirmativemessage = page.locator(TestData.selectors.endMessage);
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
    
    // Wait for h1[data-testid="end-message"] to be attached (always present in DOM)
    await this.page.waitForSelector('h1[data-testid="end-message"]', { timeout: 10000, state: 'attached' });
    
    // Optionally wait for affirmation message to have text content (non-blocking)
    try {
      await this.page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="end-message"]');
          return element && element.textContent && element.textContent.trim().length > 0;
        },
        { timeout: 5000 }
      );
    } catch {
      // Message content may still be loading, but element is present - continue
    }
  }

  async waitForMessageReady(timeout: number = 15000): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const element = document.querySelector('[data-testid="end-message"]');
        return element !== null && element.textContent && element.textContent.trim().length > 0;
      },
      { timeout }
    );
    
    await expect(this.affirmativemessage).toBeVisible({ timeout });
  }

  async isMessageVisible(): Promise<boolean> {
    return await this.affirmativemessage.isVisible().catch(() => false);
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

  /**
   * Click try again button
   */
  async clickTryAgain() {
    await this.tryAgain.waitFor({ state: 'visible', timeout: 10000 });
    await this.tryAgain.click();
  }

  /**
   * Click get help link
   */
  async clickGetHelp() {
    await this.getHelpUrl.waitFor({ state: 'visible', timeout: 10000 });
    await this.getHelpUrl.click();
  }

  /**
   * Click donate link
   */
  async clickDonate() {
    await this.donateUrl.waitFor({ state: 'visible', timeout: 10000 });
    await this.donateUrl.click();
  }

  /**
   * Get try again button locator
   */
  getTryAgainButton() {
    return this.tryAgain;
  }

  /**
   * Get get help link locator
   */
  getGetHelpLink() {
    return this.getHelpUrl;
  }

  /**
   * Get donate link locator
   */
  getDonateLink() {
    return this.donateUrl;
  }
}

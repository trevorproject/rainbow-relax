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
    this.affirmativemessage = page.getByRole('heading');
    this.getHelpUrl = page.locator(TestData.selectors.getHelpUrl);
    this.donateUrl = page.locator(TestData.selectors.donateUrl);
    
    this.lang = page.locator('lang');
}
/**
   * Navigate to the homepage
   */
  async goto() {
    await this.page.goto(TestData.urls.thankyoupage);
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


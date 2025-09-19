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
  readonly message: Locator;


  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators using TestData selectors
    this.tryAgain = page.locator(TestData.selectors.resetButton);
    this.getHelpUrl = page.locator(TestData.selectors.getHelpUrl);
    this.lang = page.locator(TestData.selectors.lang);
    this.message.locator(TestData.selectors.message);

       // Common page elements
    this.donateUrl = page.locator('donateUrl');
}
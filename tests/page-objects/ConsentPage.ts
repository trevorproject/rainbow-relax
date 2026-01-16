import { Locator, Page, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { TIMEOUTS } from '../fixtures/testConstants';

/**
 * Page Object Model for the Consent Page
 * Encapsulates all consent page functionality and elements
 */
export class ConsentPage {
  readonly page: Page;
  readonly consentPage: Locator;
  readonly consentPromptDialog: Locator;
  readonly consentPromptTitle: Locator;
  readonly consentPromptDescription: Locator;
  readonly loadFullButton: Locator;
  readonly stayLightweightButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.consentPage = page.locator(TestData.selectors.consentPage);
    this.consentPromptDialog = page.locator(TestData.selectors.consentPromptDialog);
    this.consentPromptTitle = page.locator(TestData.selectors.consentPromptTitle);
    this.consentPromptDescription = page.locator(TestData.selectors.consentPromptDescription);
    this.loadFullButton = page.locator(TestData.selectors.consentButtonLoadFull);
    this.stayLightweightButton = page.locator(TestData.selectors.consentButtonStayLightweight);
  }

  /**
   * Navigate to consent page
   */
  async goto(url?: string): Promise<void> {
    const targetUrl = url || '/consent';
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Check if consent prompt is visible
   */
  async isPromptVisible(): Promise<boolean> {
    return await this.consentPromptDialog.isVisible().catch(() => false);
  }

  /**
   * Get prompt title text
   */
  async getPromptTitle(): Promise<string | null> {
    if (await this.consentPromptTitle.isVisible()) {
      return await this.consentPromptTitle.textContent();
    }
    return null;
  }

  /**
   * Get prompt description text
   */
  async getPromptDescription(): Promise<string | null> {
    if (await this.consentPromptDescription.isVisible()) {
      return await this.consentPromptDescription.textContent();
    }
    return null;
  }

  /**
   * Click "Load Full" button
   */
  async clickLoadFull(): Promise<void> {
    await this.loadFullButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MODAL_OPEN });
    await this.loadFullButton.click();
  }

  /**
   * Click "Stay Lightweight" button
   */
  async clickStayLightweight(): Promise<void> {
    await this.stayLightweightButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MODAL_OPEN });
    await this.stayLightweightButton.click();
  }

  /**
   * Wait for consent prompt to be visible
   */
  async waitForPrompt(timeout: number = TIMEOUTS.PAGE_LOAD): Promise<void> {
    await expect(this.consentPromptDialog).toBeVisible({ timeout });
  }

  /**
   * Check if consent page element is present (may be hidden)
   */
  async isConsentPagePresent(): Promise<boolean> {
    const count = await this.consentPage.count();
    return count > 0;
  }
}

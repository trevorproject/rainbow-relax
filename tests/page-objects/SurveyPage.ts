import { Locator, Page, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { TIMEOUTS } from '../fixtures/testConstants';

export class SurveyPage {
  readonly page: Page;
  readonly surveySection: Locator;
  readonly yesButton: Locator;
  readonly skipButton: Locator;
  readonly surveyOptionSame: Locator;
  readonly surveyOptionABitBetter: Locator;
  readonly surveyOptionMoreRelaxed: Locator;
  readonly surveyOptionMuchMoreCalm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.surveySection = page.locator('section[aria-live="polite"]');
    this.yesButton = page.locator(TestData.selectors.surveyYesButton);
    this.skipButton = page.locator(TestData.selectors.surveySkipButton);
    this.surveyOptionSame = page.locator(TestData.selectors.surveyOptionSame);
    this.surveyOptionABitBetter = page.locator(TestData.selectors.surveyOptionABitBetter);
    this.surveyOptionMoreRelaxed = page.locator(TestData.selectors.surveyOptionMoreRelaxed);
    this.surveyOptionMuchMoreCalm = page.locator(TestData.selectors.surveyOptionMuchMoreCalm);
  }

  async waitForSurveyVisible(timeout: number = TIMEOUTS.NAVIGATION): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('cookie1='));
        const hasCookie = cookieValue && cookieValue.includes('cookie1=true');
        const section = document.querySelector('section[aria-live="polite"]');
        return hasCookie && section !== null;
      },
      { timeout }
    );
    
    await expect(this.surveySection).toBeVisible({ timeout });
  }

  async isSurveyVisible(): Promise<boolean> {
    return await this.surveySection.isVisible().catch(() => false);
  }

  async waitForInviteStep(): Promise<void> {
    await this.waitForSurveyVisible();
    await expect(this.yesButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    await expect(this.skipButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
  }

  async clickYesButton(): Promise<void> {
    await this.waitForInviteStep();
    await this.yesButton.click();
  }

  async clickSkipButton(): Promise<void> {
    await this.waitForInviteStep();
    await this.skipButton.click();
  }

  async waitForSurveyOptions(): Promise<void> {
    await expect(this.surveyOptionSame).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    await expect(this.surveyOptionABitBetter).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    await expect(this.surveyOptionMoreRelaxed).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    await expect(this.surveyOptionMuchMoreCalm).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
  }

  async clickSurveyOption(option: 'same' | 'a_bit_better' | 'more_relaxed' | 'much_more_calm'): Promise<void> {
    await this.waitForSurveyOptions();
    
    let optionButton: Locator;
    switch (option) {
      case 'same':
        optionButton = this.surveyOptionSame;
        break;
      case 'a_bit_better':
        optionButton = this.surveyOptionABitBetter;
        break;
      case 'more_relaxed':
        optionButton = this.surveyOptionMoreRelaxed;
        break;
      case 'much_more_calm':
        optionButton = this.surveyOptionMuchMoreCalm;
        break;
    }
    
    await optionButton.click();
  }

  async waitForSurveyResult(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText)).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
  }

  async verifySurveyCompleted(): Promise<boolean> {
    const completionDate = await this.page.evaluate(() => {
      return localStorage.getItem('survey_completion_date');
    });
    return completionDate !== null;
  }
}

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
  readonly donateUrl: Locator;
  readonly infoButton: Locator;
  readonly infoText: Locator;
  readonly logo: Locator;
  readonly titleText: Locator;
  readonly mainMessage: Locator;
  readonly quickEscapeModal: Locator;
  readonly quickEscapeModalTitle: Locator;
  readonly quickEscapeCloseButton: Locator;
  readonly oneMinButton: Locator;
  readonly threeMinButton: Locator;
  readonly fiveMinButton: Locator;
  readonly customButton: Locator;
  readonly donateButtonEn: Locator;
  readonly donateButtonEs: Locator;
  readonly donateTextEn: Locator;
  readonly donateTextEs: Locator;
  readonly soundControlContainer: Locator;
  readonly soundControlButton: Locator;
  readonly soundPanel: Locator;
  readonly backgroundToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Language controls
    this.languageToggleBase = page.locator(TestData.selectors.languageToggle);    

    // Initialize locators using TestData selectors
    this.startButton = page.locator(TestData.selectors.startButton);
    this.welcomeText = page.locator(TestData.selectors.welcomeText);
    this.languageToggle = page.locator(TestData.selectors.languageToggle);
    this.quickEscape = page.locator(TestData.selectors.quickEscape);
    this.donateUrl = page.locator(TestData.selectors.donateUrl);
    
    // Common page elements
    this.header = page.locator('header');
    this.navigation = page.locator('nav');
    this.mainContent = page.locator('main');
    this.infoButton = page.locator(TestData.selectors.infoButton);
    this.infoText = page.locator(TestData.selectors.infoText);
    this.logo = page.locator('.Logo');
    this.titleText = page.locator('h2').first();
    this.mainMessage = page.locator('p').filter({ hasText: /It's not easy to say|No es fácil expresar/ });
    
    // Quick escape modal
    this.quickEscapeModal = page.locator('.fixed.inset-0.flex.items-center.justify-center.z-\\[40\\]');
    this.quickEscapeModalTitle = page.locator('h2').filter({ hasText: /quick.?exit/i });
    this.quickEscapeCloseButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-x"]') });
    
    // Time preset buttons
    this.oneMinButton = page.locator('button').filter({ hasText: /^1 min$/i });
    this.threeMinButton = page.locator('button').filter({ hasText: /^3 min$/i });
    this.fiveMinButton = page.locator('button').filter({ hasText: /^5 min$/i });
    this.customButton = page.locator('button').filter({ hasText: /^custom$/i });
    
    // Donate buttons
    this.donateButtonEn = page.getByRole('link').filter({ hasText: 'Donate' });
    this.donateButtonEs = page.getByRole('link').filter({ hasText: 'Donar' });
    this.donateTextEn = page.locator('text="Donate"');
    this.donateTextEs = page.locator('text="Donar"');
    
    // Sound controls
    this.soundControlContainer = page.locator(TestData.selectors.soundControlContainer);
    this.soundControlButton = page.locator(TestData.selectors.soundControlButton);
    this.soundPanel = page.locator(TestData.selectors.soundPanel);
    this.backgroundToggle = page.locator(TestData.selectors.backgroundToggle);
  }


    // Get Toggle by language
  getLanguageToggle(lang: 'EN' | 'ES') {
    const re = lang === 'EN' ? /^En$/i : /^Es$/i;
    return this.page.getByRole('button', { name: re });
  }

  private toggleButton() {
    return this.page.locator(TestData.selectors.languageToggle);
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
    if (await this.getLanguageToggle(target).isVisible({ timeout: 2000 }).catch(() => false)) return;
    const toggleBtn = this.toggleButton();
    await toggleBtn.waitFor({ state: 'visible', timeout: 10000 });
    
    // Ensure QuickEscape modal is closed - it can block clicks
    const quickEscapeModal = this.page.locator('.fixed.inset-0.flex.items-center.justify-center.z-\\[40\\]');
    const isModalVisible = await quickEscapeModal.isVisible({ timeout: 2000 }).catch(() => false);
    if (isModalVisible) {
      // Try to close the modal by clicking the close button
      const closeButton = this.page.locator('button').filter({ has: this.page.locator('svg[class*="lucide-x"]') });
      await closeButton.click({ timeout: 5000, force: true }).catch(() => {});
      // Wait for modal to disappear
      await quickEscapeModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
    
    await toggleBtn.waitFor({ state: 'attached', timeout: 10000 });
    try {
      await toggleBtn.scrollIntoViewIfNeeded({ timeout: 5000 });
    } catch {
      // Element might already be in view, continue
    }
    
    // Use force click to bypass any overlays (especially in CI/local when modal might interfere)
    const clickOptions = { timeout: 20000, force: true };
    await toggleBtn.click(clickOptions);
    await this.getLanguageToggle(target).waitFor({ state: 'visible', timeout: 10000 });
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
   * Check if quick escape is available
   */
  async hasQuickEscape() {
    return await this.quickEscape.isVisible();
  }

  /**
   * Click the info button to toggle explanation text
   */
  async clickInfoButton() {
    // Ensure QuickEscape modal is closed - it can block clicks
    const quickEscapeModal = this.page.locator('.fixed.inset-0.flex.items-center.justify-center.z-\\[40\\]');
    const isModalVisible = await quickEscapeModal.isVisible({ timeout: 2000 }).catch(() => false);
    if (isModalVisible) {
      // Try to close the modal by clicking the close button
      const closeButton = this.page.locator('button').filter({ has: this.page.locator('svg[class*="lucide-x"]') });
      await closeButton.click({ timeout: 5000, force: true }).catch(() => {});
      // Wait for modal to disappear
      await quickEscapeModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
    
    // Wait for info button to be visible and actionable
    await this.infoButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Scroll element into view to ensure it's actionable
    await this.infoButton.scrollIntoViewIfNeeded();
    
    // Use force click to bypass any overlays
    const clickOptions = { timeout: 20000, force: true };
    await this.infoButton.click(clickOptions);
  }

  /**
   * Check if info button is visible
   */
  async hasInfoButton() {
    return await this.infoButton.isVisible();
  }

  /**
   * Check if info text is visible
   */
  async isInfoTextVisible() {
    return await this.infoText.isVisible();
  }

  /**
   * Get info text content
   */
  async getInfoTextContent() {
    return await this.infoText.textContent();
  }

  /**
   * Click the logo to navigate to homepage
   */
  async clickLogo() {
    await this.logo.click();
  }

  /**
   * Check if logo is visible
   */
  async hasLogo() {
    return await this.logo.isVisible();
  }

  /**
   * Get title text content
   */
  async getTitleTextContent() {
    return await this.titleText.textContent();
  }

  /**
   * Get main message content
   */
  async getMainMessageContent() {
    return await this.mainMessage.textContent();
  }

  /**
   * Hover over info button to see tooltip
   */
  async hoverInfoButton() {
    await this.infoButton.hover();
  }

  /**
   * Get info button title attribute
   */
  async getInfoButtonTitle() {
    return await this.infoButton.getAttribute('title');
  }

  /**
   * Click the 1 minute preset button
   */
  async clickOneMinButton() {
    await this.oneMinButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.oneMinButton.click();
  }

  /**
   * Click the 3 minute preset button
   */
  async clickThreeMinButton() {
    await this.threeMinButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.threeMinButton.click();
  }

  /**
   * Click the 5 minute preset button
   */
  async clickFiveMinButton() {
    await this.fiveMinButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.fiveMinButton.click();
  }

  /**
   * Click the custom time button
   */
  async clickCustomButton() {
    await this.customButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.customButton.click();
  }

  /**
   * Check if quick escape modal is visible
   */
  async isQuickEscapeModalVisible() {
    return await this.quickEscapeModalTitle.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Close the quick escape modal if visible
   */
  async closeQuickEscapeModal() {
    const isVisible = await this.isQuickEscapeModalVisible();
    if (isVisible) {
      await this.quickEscapeCloseButton.click({ timeout: 5000, force: true }).catch(() => {});
      await this.quickEscapeModalTitle.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  /**
   * Click donate button (works for both languages)
   */
  async clickDonateButton() {
    // Try English first, then Spanish
    const donateEnVisible = await this.donateButtonEn.isVisible({ timeout: 2000 }).catch(() => false);
    if (donateEnVisible) {
      await this.donateButtonEn.click({ timeout: 15000 });
    } else {
      await this.donateButtonEs.click({ timeout: 15000 });
    }
  }

  /**
   * Open sound control panel
   */
  async openSoundControlPanel() {
    await this.soundControlButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.soundControlButton.click();
    await this.soundPanel.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Toggle background sounds
   */
  async toggleBackgroundSounds() {
    if (!(await this.soundPanel.isVisible({ timeout: 2000 }).catch(() => false))) {
      await this.openSoundControlPanel();
    }
    await this.backgroundToggle.click();
  }
}

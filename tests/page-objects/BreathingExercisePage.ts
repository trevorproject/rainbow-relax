import { Locator, Page } from '@playwright/test';
import TestData from '../fixtures/testData';

/**
 * Page Object Model for the Breathing Exercise page
 * Encapsulates all breathing exercise functionality and elements
 */
export class BreathingExercisePage {
  readonly page: Page;

  //Language elements
  readonly languageToggleBase: Locator;
  
  // Exercise elements
  readonly breathingCircle: Locator;
  readonly pauseButton: Locator;
  readonly resetButton: Locator;
  readonly playButton: Locator;
  readonly instructions: Locator;
  
  // Audio elements
  readonly musicToggle: Locator;
  readonly audioControls: Locator;
  
  // Progress elements
  readonly progressIndicator: Locator;
  readonly timer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Language controls
    this.languageToggleBase = page.locator(TestData.selectors.languageToggle);
    // Exercise controls
    this.breathingCircle = page.locator(TestData.selectors.breathingCircle);
    this.pauseButton = page.locator(TestData.selectors.pauseButton);
    this.resetButton = page.locator(TestData.selectors.resetButton);
    this.playButton = page.locator(TestData.selectors.playButton);
    this.instructions = page.locator(TestData.selectors.instructionText);
    
    // Audio controls
    this.musicToggle = page.locator(TestData.selectors.soundToggle);
    this.audioControls = page.locator(TestData.selectors.soundToggle);
    
    // Progress indicators
    this.progressIndicator = page.locator('[data-testid="progress"], [data-testid="cycle-count"]');
    this.timer = page.locator(TestData.selectors.timer);
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
   * Navigate directly to the exercise page
   */
  async goto() {
    await this.page.goto(TestData.urls.exercise);
  }

   /**
   * Change language
   */
  async switchLanguage(target: 'EN' | 'ES') {
    if (await this.getLanguageToggle(target).isVisible({ timeout: 2000 }).catch(() => false)) return;
    const toggleBtn = this.toggleButton();
    await toggleBtn.waitFor({ state: 'visible', timeout: 10000 });
    
    // Ensure QuickEscape modal is closed - it can block clicks
    const quickEscapeModal = this.page.locator('.fixed.inset-0.flex.items-center.justify-center.z-3');
    const isModalVisible = await quickEscapeModal.isVisible({ timeout: 2000 }).catch(() => false);
    if (isModalVisible) {
      // Try to close the modal by clicking the close button
      const closeButton = this.page.locator('button').filter({ has: this.page.locator('svg[class*="lucide-x"]') });
      await closeButton.click({ timeout: 5000, force: true }).catch(() => {});
      // Wait for modal to disappear
      await quickEscapeModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
    
    // Scroll element into view to ensure it's actionable
    await toggleBtn.scrollIntoViewIfNeeded();
    
    // Use force click to bypass any overlays
    const clickOptions = { timeout: 20000, force: true };
    await toggleBtn.click(clickOptions);
    await this.getLanguageToggle(target).waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Pause the exercise
   */
  async pauseExercise() {
    await this.pauseButton.click();
  }

  /**
   * Resume the exercise
   */
  async resumeExercise() {
    await this.playButton.click();
  }

  /**
   * Reset the exercise
   */
  async resetExercise() {
    await this.resetButton.click();
  }

  /**
   * Toggle background music
   */
  async toggleMusic() {
    await this.musicToggle.click();
  }

  /**
   * Check if the exercise is currently active/running
   */
  async isExerciseActive() {
    return await this.breathingCircle.evaluate((element) => {
      const computedStyle = window.getComputedStyle(element);
      return computedStyle.animationName !== 'none' || 
             computedStyle.transform !== 'none' ||
             element.classList.contains('animate') ||
             element.classList.contains('breathing') ||
             element.classList.contains('active');
    });
  }

  /**
   * Check if the exercise is paused
   */
  async isExercisePaused() {
    return await this.pauseButton.isHidden() && await this.playButton.isVisible();
  }

  /**
   * Get the current instruction text
   */
  async getCurrentInstruction() {
    if (await this.instructions.isVisible()) {
      return await this.instructions.textContent();
    }
    return null;
  }

  /**
   * Check if audio controls are available
   */
  async hasAudioControls() {
    return await this.audioControls.count() > 0;
  }

  /**
   * Check if progress indicators are available
   */
  async hasProgressIndicators() {
    return await this.progressIndicator.isVisible() || await this.timer.isVisible();
  }

  /**
   * Wait for exercise to complete one cycle
   * (This is a simplified version - adjust timing based on your app)
   * Note: This method should be replaced with state-based waits instead of timeouts
   */
  async waitForCycleCompletion() {
    // Wait for timer to change, indicating cycle completion
    // This is a placeholder - should be replaced with proper state-based waiting
    await this.timer.waitFor({ state: 'visible', timeout: TestData.animations.breathingCycleDuration });
  }

  /**
   * Verify all essential elements are loaded
   */
  async isLoaded() {
    return await this.breathingCircle.isVisible();
  }
}

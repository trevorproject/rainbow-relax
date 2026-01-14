import { Locator, Page, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { TIMEOUTS } from '../fixtures/testConstants';

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
  readonly soundControlContainer: Locator;
  readonly soundControlButton: Locator;
  readonly soundPanel: Locator;
  readonly soundPanelTitle: Locator;
  readonly backgroundToggle: Locator;
  readonly instructionsToggle: Locator;
  readonly guideToggle: Locator;
  readonly muteAllButton: Locator;
  
  // Progress elements
  readonly progressIndicator: Locator;
  readonly timer: Locator;
  
  // Page content elements
  readonly exerciseTitle: Locator;
  readonly introInstructions: Locator;
  readonly backButton: Locator;

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
    this.soundControlContainer = page.locator(TestData.selectors.soundControlContainer);
    this.soundControlButton = page.locator(TestData.selectors.soundControlButton);
    this.soundPanel = page.locator(TestData.selectors.soundPanel);
    this.backgroundToggle = page.locator(TestData.selectors.backgroundToggle);
    this.instructionsToggle = page.locator(TestData.selectors.instructionsToggle);
    this.guideToggle = page.locator(TestData.selectors.guideToggle);
    this.muteAllButton = page.locator(TestData.selectors.muteAllButton);
    
    // Progress indicators
    this.progressIndicator = page.locator('[data-testid="progress"], [data-testid="cycle-count"]');
    this.timer = page.locator(TestData.selectors.timer);
    
    // Page content
    this.exerciseTitle = page.locator(TestData.selectors.exerciseTitle);
    this.introInstructions = page.locator(TestData.selectors.exerciseIntroText);
    this.backButton = page.locator(TestData.selectors.backButton);
    this.soundPanelTitle = page.locator(TestData.selectors.soundPanelTitle);
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
    if (await this.getLanguageToggle(target).isVisible({ timeout: TIMEOUTS.ANIMATION_SHORT }).catch(() => false)) return;
    const toggleBtn = this.toggleButton();
    await toggleBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.NAVIGATION });
    
    // Ensure QuickEscape modal is closed - it can block clicks
    const quickEscapeModal = this.page.locator(TestData.selectors.quickEscapeModal);
    const isModalVisible = await quickEscapeModal.isVisible({ timeout: TIMEOUTS.ANIMATION_SHORT }).catch(() => false);
    if (isModalVisible) {
      // Try to close the modal by clicking the close button
      const closeButton = this.page.locator(TestData.selectors.quickEscapeCloseButton);
      await closeButton.click({ timeout: TIMEOUTS.MODAL_CLOSE, force: true }).catch(() => {});
      // Wait for modal to disappear
      await quickEscapeModal.waitFor({ state: 'hidden', timeout: TIMEOUTS.MODAL_CLOSE }).catch(() => {});
    }
    
    // Scroll element into view to ensure it's actionable
    await toggleBtn.scrollIntoViewIfNeeded();
    
    // Use force click to bypass any overlays
    const clickOptions = { timeout: TIMEOUTS.ANIMATION_LONG, force: true };
    await toggleBtn.click(clickOptions);
    await this.getLanguageToggle(target).waitFor({ state: 'visible', timeout: TIMEOUTS.NAVIGATION });
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
   * Open the sound control panel
   */
  async openSoundControlPanel() {
    await this.soundControlContainer.waitFor({ state: 'attached', timeout: TIMEOUTS.NAVIGATION });
    await this.soundControlButton.waitFor({ state: 'visible', timeout: TIMEOUTS.NAVIGATION });
    
    // Check if panel is already open
    const isAlreadyOpen = await this.soundPanel.isVisible().catch(() => false);
    if (isAlreadyOpen) {
      return;
    }
    
    // Ensure button is ready for interaction
    await this.soundControlButton.waitFor({ state: 'attached', timeout: TIMEOUTS.ANIMATION_MEDIUM });
    
    // Scroll button into view if needed
    await this.soundControlButton.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.ANIMATION_MEDIUM }).catch(() => {});
    
    // Move mouse away from button to avoid hover effects interfering
    await this.page.mouse.move(100, 100);
    
    // Wait for any hover effects to settle using proper state wait
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.ANIMATION_SHORT }).catch(() => {});
    
    // Click the button
    await this.soundControlButton.click({ timeout: TIMEOUTS.NAVIGATION, force: false });
    
    // Wait for sound panel to appear using expect (more reliable)
    const soundPanel = this.page.locator(TestData.selectors.soundPanel);
    await expect(soundPanel).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    
    // Wait for the panel to be visible and animation to complete
    // Check both visibility and opacity to ensure animation has progressed
    await this.page.waitForFunction(
      (selector) => {
        const panel = document.querySelector(selector) as HTMLElement | null;
        if (!panel) return false;
        const style = window.getComputedStyle(panel);
        const opacity = parseFloat(style.opacity);
        const display = style.display;
        const visibility = style.visibility;
        // Panel is visible when opacity > 0.5, display !== 'none', and visibility !== 'hidden'
        return opacity > 0.5 && display !== 'none' && visibility !== 'hidden';
      },
      '[data-testid="sound-control-panel"]',
      { timeout: TIMEOUTS.NAVIGATION }
    );
    
    // Additional check: ensure Playwright's visibility check also passes
    await this.soundPanel.waitFor({ state: 'visible', timeout: TIMEOUTS.ANIMATION_MEDIUM });
  }

  /**
   * Check if sound panel is visible
   */
  async isSoundPanelVisible() {
    return await this.soundPanel.isVisible();
  }

  /**
   * Toggle background sounds
   */
  async toggleBackgroundSounds() {
    if (!(await this.isSoundPanelVisible())) {
      await this.openSoundControlPanel();
    }
    await this.backgroundToggle.click();
  }

  /**
   * Toggle instructions sounds
   */
  async toggleInstructions() {
    if (!(await this.isSoundPanelVisible())) {
      await this.openSoundControlPanel();
    }
    await this.instructionsToggle.click();
  }

  /**
   * Toggle exercise guide sounds
   */
  async toggleExerciseGuide() {
    if (!(await this.isSoundPanelVisible())) {
      await this.openSoundControlPanel();
    }
    await this.guideToggle.click();
  }

  /**
   * Toggle background music (legacy method - now toggles background sounds)
   */
  async toggleMusic() {
    await this.toggleBackgroundSounds();
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
    return await this.soundControlButton.isVisible();
  }

  /**
   * Check if progress indicators are available
   */
  async hasProgressIndicators() {
    return await this.progressIndicator.isVisible() || await this.timer.isVisible();
  }

  /**
   * Wait for exercise to complete one cycle
   * Uses state-based waiting for instruction changes
   */
  async waitForCycleCompletion() {
    // Wait for a complete cycle: inhale -> hold -> exhale -> inhale
    await this.waitForInstructionMatching(/hold/i, 6000);
    await this.waitForInstructionMatching(/exhale|mouth/i, 9000);
    await this.waitForInstructionMatching(/breathe|nose|inhale/i, 10000);
  }

  /**
   * Verify all essential elements are loaded
   */
  async isLoaded() {
    return await this.breathingCircle.isVisible();
  }

  /**
   * Navigate back to home page
   */
  async navigateBack() {
    await this.backButton.click();
  }

  /**
   * Check if exercise title is visible
   */
  async isExerciseTitleVisible() {
    return await this.exerciseTitle.isVisible();
  }

  /**
   * Check if intro instructions are visible
   */
  async isIntroInstructionsVisible() {
    return await this.introInstructions.isVisible();
  }

  /**
   * Get intro instructions text
   */
  async getIntroInstructionsText() {
    if (await this.introInstructions.isVisible()) {
      return await this.introInstructions.textContent();
    }
    return null;
  }

  /**
   * Get timer value as number (extracts minutes and seconds)
   */
  async getTimerValue(): Promise<{ minutes: number; seconds: number } | null> {
    const timerText = await this.getTimerText();
    if (!timerText) return null;
    
    const match = timerText.match(/(\d+):(\d+)/);
    if (match) {
      return {
        minutes: parseInt(match[1], 10),
        seconds: parseInt(match[2], 10),
      };
    }
    return null;
  }

  /**
   * Get timer display text
   */
  async getTimerText(): Promise<string | null> {
    if (await this.timer.isVisible()) {
      return await this.timer.textContent();
    }
    return null;
  }

  /**
   * Get current instruction text
   */
  async getCurrentInstructionText(): Promise<string | null> {
    return await this.getCurrentInstruction();
  }

  /**
   * Check if exercise is in intro phase
   */
  async isInIntroPhase(): Promise<boolean> {
    return await this.exerciseTitle.isVisible() && await this.introInstructions.isVisible();
  }

  /**
   * Check if exercise is in running phase
   */
  async isInRunningPhase(): Promise<boolean> {
    return await this.timer.isVisible() && await this.instructions.isVisible();
  }

  /**
   * Wait for instruction text to change to expected value (assertion-based)
   * @param expectedText - Text or pattern to match in instruction
   * @param timeout - Maximum time to wait
   */
  async waitForInstructionChange(expectedText: string | RegExp, timeout: number = TIMEOUTS.EXERCISE_PHASE_TRANSITION): Promise<void> {
    const regexPattern = expectedText instanceof RegExp ? expectedText : new RegExp(expectedText, 'i');
    await expect(this.instructions).toHaveText(regexPattern, { timeout });
  }

  /**
   * Wait for instruction to change from current text to a different text (assertion-based)
   * @param currentText - Current instruction text pattern to wait for change from
   * @param timeout - Maximum time to wait
   */
  async waitForInstructionToChangeFrom(currentText: string | RegExp, timeout: number = TIMEOUTS.EXERCISE_PHASE_TRANSITION): Promise<void> {
    const regexPattern = currentText instanceof RegExp ? currentText : new RegExp(currentText, 'i');
    await expect(this.instructions).not.toHaveText(regexPattern, { timeout });
  }

  /**
   * Wait for instruction to match a specific pattern (assertion-based)
   * Uses toContainText which works better with regex patterns
   * @param pattern - Text or regex pattern to match
   * @param timeout - Maximum time to wait
   */
  async waitForInstructionMatching(pattern: string | RegExp, timeout: number = TIMEOUTS.EXERCISE_PHASE_TRANSITION): Promise<void> {
    if (pattern instanceof RegExp) {
      await expect(this.instructions).toHaveText(pattern, { timeout });
    } else {
      await expect(this.instructions).toContainText(pattern, { timeout });
    }
  }

  /**
   * Wait for instruction to NOT match a specific pattern (assertion-based)
   * @param pattern - Text or regex pattern that should NOT match
   * @param timeout - Maximum time to wait
   */
  async waitForInstructionNotMatching(pattern: string | RegExp, timeout: number = TIMEOUTS.EXERCISE_PHASE_TRANSITION): Promise<void> {
    const regexPattern = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
    await expect(this.instructions).not.toHaveText(regexPattern, { timeout });
  }
}

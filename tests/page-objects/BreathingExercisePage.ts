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
  readonly soundPanelTitle: Locator;

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
    this.exerciseTitle = page.locator('h2').filter({ hasText: /breathing exercise/i });
    this.introInstructions = page.locator('p').filter({ hasText: /inhale.*for.*4.*seconds.*hold.*for.*7.*seconds.*and.*exhale.*for.*8.*seconds/i });
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
   * Open the sound control panel
   */
  async openSoundControlPanel() {
    await this.soundControlContainer.waitFor({ state: 'attached', timeout: 10000 });
    await this.soundControlButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Check if panel is already open
    const isAlreadyOpen = await this.soundPanel.isVisible().catch(() => false);
    if (isAlreadyOpen) {
      return;
    }
    
    // Ensure button is ready for interaction
    await this.soundControlButton.waitFor({ state: 'attached', timeout: 5000 });
    
    // Scroll button into view if needed
    await this.soundControlButton.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    
    // Move mouse away from button to avoid hover effects interfering
    await this.page.mouse.move(100, 100);
    await this.page.waitForTimeout(50);
    
    await this.soundControlButton.click({ timeout: 10000, force: false });
    
    // First wait for panel to be attached to DOM (it's conditionally rendered)
    await this.soundPanel.waitFor({ state: 'attached', timeout: 10000 });
    
    // Wait for the animation to complete and panel to be visible
    // The panel uses Framer Motion with 300ms animation, so we need to account for that
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
      { timeout: 10000 }
    );
    
    // Additional check: ensure Playwright's visibility check also passes
    await this.soundPanel.waitFor({ state: 'visible', timeout: 5000 });
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
}

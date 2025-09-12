import { Locator, Page } from '@playwright/test';
import TestData from '../fixtures/testData';

/**
 * Page Object Model for the Breathing Exercise page
 * Encapsulates all breathing exercise functionality and elements
 */
export class BreathingExercisePage {
  readonly page: Page;
  
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
    
    // Exercise controls
    this.breathingCircle = page.locator(TestData.selectors.breathingCircle);
    this.pauseButton = page.locator(TestData.selectors.pauseButton);
    this.resetButton = page.locator(TestData.selectors.resetButton);
    this.playButton = page.locator('[data-testid="play-button"]');
    this.instructions = page.locator('[data-testid*="instruction"], [data-testid*="guidance"]');
    
    // Audio controls
    this.musicToggle = page.locator('[data-testid="music-toggle"], [data-testid="background-audio"]');
    this.audioControls = page.locator('[data-testid*="audio"], [data-testid*="sound"]');
    
    // Progress indicators
    this.progressIndicator = page.locator('[data-testid="progress"], [data-testid="cycle-count"]');
    this.timer = page.locator('[data-testid="timer"], [data-testid="countdown"]');
  }

  /**
   * Navigate directly to the exercise page
   */
  async goto() {
    await this.page.goto(TestData.urls.exercise);
  }

  /**
   * Start the breathing exercise
   */
  async startExercise() {
    const startButton = this.page.locator('[data-testid="start-button"], [data-testid="begin-exercise"]');
    if (await startButton.isVisible()) {
      await startButton.click();
    }
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
   */
  async waitForCycleCompletion() {
    // Wait for a 4-7-8 cycle to complete (approximately 20 seconds)
    await this.page.waitForTimeout(TestData.animations.breathingCycleDuration);
  }

  /**
   * Verify all essential elements are loaded
   */
  async isLoaded() {
    return await this.breathingCircle.isVisible();
  }
}

import { Page } from '@playwright/test';
import TestData from './testData';
import { HomePage, BreathingExercisePage } from '../page-objects';

/**
 * Closes the QuickEscape modal if it's visible on the page.
 * This is a common precondition needed across multiple test files.
 * 
 * @param page - The Playwright page object
 */
export async function closeQuickEscapeModal(page: Page): Promise<void> {
  const closeButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-x"]') });
  
  try {
    // Wait up to 5 seconds for the close button to be visible
    await closeButton.waitFor({ state: 'visible', timeout: 5000 });
    await closeButton.click();
    await page.waitForSelector('h2:has-text("Quick Exit")', { state: 'hidden' });
  } catch {
    // Modal not present or already closed - this is fine, continue
  }
}

/**
 * Navigates to homepage and closes QuickEscape modal if present.
 * This is a common setup pattern used across multiple test files.
 * 
 * @param page - The Playwright page object
 * @param url - The URL to navigate to (defaults to '/')
 */
export async function setupPageWithoutQuickEscape(page: Page, url: string = '/'): Promise<void> {
  await page.goto(url);
  await closeQuickEscapeModal(page);
}

/**
 * Waits for the breathing exercise page to load completely.
 * This waits for the breathing exercise content to be visible.
 * 
 * @param page - The Playwright page object
 * @param timeout - Maximum time to wait (defaults to 30 seconds)
 * @param waitForTimer - If true, also waits for timer to appear (exercise has started), defaults to false
 */
export async function waitForBreathingExerciseToStart(page: Page, timeout: number = 30000, waitForTimer: boolean = false): Promise<void> {
  // Wait for the breathing exercise page content to be visible
  await page.waitForFunction(
    () => {
      // Check for breathing exercise specific elements
      const breathingTitle = document.querySelector('h2');
      const instructions = document.querySelector('p');
      return breathingTitle && 
             instructions && 
             /breathing exercise/i.test(breathingTitle.textContent || '') &&
             /inhale.*exhale/i.test(instructions.textContent || '');
    },
    { timeout }
  );

  // If requested, also wait for timer to appear (exercise has started, not in intro)
  if (waitForTimer) {
    const timer = page.locator(TestData.selectors.timer);
    await timer.waitFor({ state: 'visible', timeout }).catch(() => {
      // Timer might not appear if still in intro - this is OK
    });
  }
}

/**
 * Waits for the breathing exercise timer to appear (exercise has started, intro phase is over).
 * This is useful when you need to ensure the exercise is actually running.
 * 
 * @param page - The Playwright page object
 * @param timeout - Maximum time to wait (defaults to 20000ms to account for intro phase)
 */
export async function waitForExerciseTimer(page: Page, timeout: number = 20000): Promise<void> {
  await page.waitForSelector(TestData.selectors.timer, { state: 'attached', timeout });
  const timer = page.locator(TestData.selectors.timer);
  await timer.waitFor({ state: 'visible', timeout });
  await page.waitForFunction(
    (selector) => {
      const element = document.querySelector(selector);
      return element && element.textContent && element.textContent.trim().length > 0;
    },
    TestData.selectors.timer,
    { timeout }
  );
}

/**
 * Waits for breathing instructions to be visible and contain expected content.
 * 
 * @param page - The Playwright page object
 * @param timeout - Maximum time to wait (defaults to 15 seconds)
 */
export async function waitForBreathingInstructions(page: Page, timeout: number = 15000): Promise<void> {
  // Wait for breathing instructions to appear
  await page.waitForFunction(
    () => {
      const paragraphs = document.querySelectorAll('p');
      return Array.from(paragraphs).some(p => 
        /(inhale|exhale|hold)/i.test(p.textContent || '')
      );
    },
    { timeout }
  );
}

/**
 * Sets up the exercise page by navigating from homepage and waiting for exercise to load.
 * This is a common pattern used across multiple test files.
 * 
 * @param page - The Playwright page object
 * @returns Object containing both HomePage and BreathingExercisePage instances
 */
export async function setupExercisePage(page: Page): Promise<{ homePage: HomePage; exercisePage: BreathingExercisePage }> {
  const homePage = new HomePage(page);
  await homePage.closeQuickEscapeModal();
  await homePage.clickOneMinButton();
  
  const exercisePage = new BreathingExercisePage(page);
  await exercisePage.exerciseTitle.waitFor({ state: 'visible', timeout: 15000 });
  
  return { homePage, exercisePage };
}

/**
 * Closes the sound control panel by clicking outside of it.
 * Waits for the click listener to be set up (panel has a 100ms delay) and clicks on a safe area.
 * 
 * @param page - The Playwright page object
 * @param exercisePage - The BreathingExercisePage instance
 */
export async function closeSoundControlPanel(page: Page, exercisePage: BreathingExercisePage): Promise<void> {
  // Wait for panel to be visible and click listener to be set up (100ms delay + buffer)
  await exercisePage.soundPanel.waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(200); // Wait for click listener to be attached
  
  // Get viewport size to click in a safe area (center-left, away from top-right panel)
  const viewport = page.viewportSize();
  if (viewport) {
    // Click in the center-left area, well away from the top-right panel
    const clickX = Math.floor(viewport.width * 0.2); // 20% from left
    const clickY = Math.floor(viewport.height * 0.5); // 50% from top (center)
    await page.click('body', { position: { x: clickX, y: clickY } });
  } else {
    // Fallback: click on exercise title if viewport is not available
    await exercisePage.exerciseTitle.click({ timeout: 5000 });
  }
  
  // Wait for panel to close with animation
  await exercisePage.soundPanel.waitFor({ state: 'hidden', timeout: 5000 });
}

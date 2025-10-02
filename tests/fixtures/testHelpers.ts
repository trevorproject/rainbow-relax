import { Page } from '@playwright/test';

/**
 * Closes the QuickEscape modal if it's visible on the page.
 * This is a common precondition needed across multiple test files.
 * 
 * @param page - The Playwright page object
 */
export async function closeQuickEscapeModal(page: Page): Promise<void> {
  const closeButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-x"]') });
  if (await closeButton.isVisible()) {
    await closeButton.click();
    await page.waitForSelector('h2:has-text("Quick Exit")', { state: 'hidden' });
  }
}

/**
 * Navigates to homepage and closes QuickEscape modal if present.
 * This is a common setup pattern used across multiple test files.
 * 
 * @param page - The Playwright page object
 * @param url - The URL to navigate to (defaults to '/')
 */
export async function setupPageWithoutQuickEscape(page: Page, url: string = './'): Promise<void> {
  await page.goto(url);
  await closeQuickEscapeModal(page);
}

/**
 * Waits for the breathing exercise to start by looking for the timer element.
 * This replaces hardcoded timeouts with conditional waiting.
 * 
 * @param page - The Playwright page object
 * @param timeout - Maximum time to wait (defaults to 30 seconds)
 */
export async function waitForBreathingExerciseToStart(page: Page, timeout: number = 30000): Promise<void> {
  // Wait for the timer to appear, which indicates the exercise has started
  await page.waitForFunction(
    () => {
      const timerElement = document.querySelector('h2');
      return timerElement && /\d+:\d+/.test(timerElement.textContent || '');
    },
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

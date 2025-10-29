import { Page } from '@playwright/test';

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
 */
export async function waitForBreathingExerciseToStart(page: Page, timeout: number = 30000): Promise<void> {
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

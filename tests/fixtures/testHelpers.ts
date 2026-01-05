import { Page } from '@playwright/test';
import TestData from './testData';
import { HomePage, BreathingExercisePage } from '../page-objects';

export async function closeQuickEscapeModal(page: Page): Promise<void> {
  const closeButton = page
    .locator('button')
    .filter({ has: page.locator('svg[class*="lucide-x"]') });

  try {
    await closeButton.waitFor({ state: 'visible', timeout: 5000 });
    await closeButton.click();
    await page.waitForSelector('h2:has-text("Quick Exit")', { state: 'hidden' });
  } catch { //This is ok
  }
}

export async function setupPageWithoutQuickEscape(page: Page, url: string = '/'): Promise<void> {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await closeQuickEscapeModal(page);
}

export async function waitForBreathingExerciseToStart(
  page: Page,
  timeout: number = 30000,
  waitForTimer: boolean = false
): Promise<void> {
  await page.waitForFunction(
    () => {
      const breathingTitle = document.querySelector('h2');
      const instructions = document.querySelector('p');
      return (
        breathingTitle &&
        instructions &&
        /breathing exercise/i.test(breathingTitle.textContent || '') &&
        /inhale.*exhale/i.test(instructions.textContent || '')
      );
    },
    { timeout }
  );

  if (waitForTimer) {
    const timer = page.locator(TestData.selectors.timer);
    await timer.waitFor({ state: 'visible', timeout }).catch(() => {});
  }
}


export async function waitForExerciseTimer(page: Page, timeout: number = 20000): Promise<void> {
  await page.waitForSelector(TestData.selectors.timer, { state: 'attached', timeout });

  const timer = page.locator(TestData.selectors.timer);
  await timer.waitFor({ state: 'visible', timeout });

  await page.waitForFunction(
    (selector) => {
      const el = document.querySelector(selector);
      return !!(el && el.textContent && el.textContent.trim().length > 0);
    },
    TestData.selectors.timer,
    { timeout }
  );
}


export async function waitForBreathingInstructions(page: Page, timeout: number = 15000): Promise<void> {
  await page.waitForFunction(
    () => {
      const paragraphs = document.querySelectorAll('p');
      return Array.from(paragraphs).some((p) => /(inhale|exhale|hold)/i.test(p.textContent || ''));
    },
    { timeout }
  );
}


export async function acceptCookieIfExist(page: Page): Promise<void> {
  const acceptBtnById = page.locator('button#rcc-confirm-button');
  const banner = page.locator('.CookieConsent');

  try {
    if (await banner.first().isVisible({ timeout: 1500 }).catch(() => false)) {
      if (await acceptBtnById.isVisible().catch(() => false)) {
        await acceptBtnById.click();
      } else {
        const acceptByText = banner.locator('button', { hasText: /accept|acept/i });
        if (await acceptByText.first().isVisible().catch(() => false)) {
          await acceptByText.first().click();
        }
      }


      await banner.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  } catch {
    //This is ok
  }
}

/**
 * Waits for consent redirects to complete and URL to stabilize.
 * This ensures that if the page redirects through /consent, it has finished
 * redirecting back to the target page with parameters preserved.
 * 
 * @param page - The Playwright page object
 * @param expectedPath - The expected path after consent (defaults to '/')
 * @param timeout - Maximum time to wait (defaults to 10000ms)
 */
export async function waitForConsentRedirect(page: Page, expectedPath: string = '/', timeout: number = 10000): Promise<void> {
  try {
    await page.waitForFunction(
      ({ path }) => {
        const currentPath = window.location.pathname;
        return currentPath !== '/consent' && currentPath === path;
      },
      { path: expectedPath },
      { timeout }
    );
  } catch {
    // Modal not present or already closed - this is fine, continue
  }
}

/**
 * Sets up the breathing exercise page by navigating to homepage,
 * closing quick escape modal, clicking the 1 min button, and waiting for exercise to load.
 * 
 * @param page - The Playwright page object
 * @returns An object containing the HomePage and BreathingExercisePage instances
 */
export async function setupExercisePage(page: Page): Promise<{ homePage: HomePage; exercisePage: BreathingExercisePage }> {
  const homePage = new HomePage(page);
  await page.goto('/?showquickescape=false', { waitUntil: 'domcontentloaded' });
  
  await homePage.closeQuickEscapeModal();
  
  await homePage.clickOneMinButton();
  
  const exercisePage = new BreathingExercisePage(page);
  await exercisePage.exerciseTitle.waitFor({ state: 'visible', timeout: 15000 });
  
  return { homePage, exercisePage };
}

/**
 * Closes the sound control panel by clicking outside of it.
 * The panel closes when clicking outside the button or panel itself.
 * 
 * @param page - The Playwright page object
 */
export async function closeSoundControlPanel(page: Page): Promise<void> {
  // Click on a safe area outside the panel (top-left corner of the page)
  // This triggers the click-outside handler in SoundControlPanel component
  await page.mouse.click(10, 10);
  await page.waitForTimeout(100); // Small delay to allow the close animation
}

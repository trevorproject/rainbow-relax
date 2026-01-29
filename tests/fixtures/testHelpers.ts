import { Page, expect } from '@playwright/test';
import TestData from './testData';
import { TIMEOUTS } from './testConstants';
import { HomePage, BreathingExercisePage } from '../page-objects';

export async function closeQuickEscapeModal(page: Page): Promise<void> {
  const modal = page.locator(TestData.selectors.quickEscapeModal);
  const closeButton = page.locator(TestData.selectors.quickEscapeCloseButton);
  
  const isVisible = await modal.isVisible().catch(() => false);
  if (!isVisible) return;
  
  await closeButton.click();
  await expect(modal).toBeHidden();
}

export async function acceptCookieIfExist(page: Page): Promise<void> {
  const acceptBtnById = page.locator('button#rcc-confirm-button');
  const banner = page.locator('.CookieConsent');

  try {
    if (await banner.first().isVisible({ timeout: TIMEOUTS.ANIMATION_SHORT }).catch(() => false)) {
      if (await acceptBtnById.isVisible().catch(() => false)) {
        await acceptBtnById.click();
      } else {
        const acceptByText = banner.locator('button', { hasText: /accept|acept/i });
        if (await acceptByText.first().isVisible().catch(() => false)) {
          await acceptByText.first().click();
        }
      }

      await banner.first().waitFor({ state: 'hidden', timeout: TIMEOUTS.MODAL_CLOSE }).catch(() => {});
      
      await page.evaluate(() => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 150);
        localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
          value: 'true',
          expires: expirationDate.getTime(),
        }));
      });
    }
  } catch {
    // Cookie banner may not be present
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
  const container = page.locator(TestData.selectors.soundControlContainer);
  await container.waitFor({ state: 'visible', timeout: TIMEOUTS.MODAL_OPEN });

  const box = await container.boundingBox();
  if (!box) throw new Error('Cannot get boundingBox from sound-control-container');

  const clickX = Math.max(box.x - 20, 0);
  const clickY = Math.max(box.y - 20, 0);
  await page.mouse.click(clickX, clickY);
}

export async function waitForExerciseIntroPhase(page: Page): Promise<void> {
  const introTitle = page.locator(TestData.selectors.exerciseTitle);
  const introText = page.locator(TestData.selectors.exerciseIntroText);
  
  await expect(introTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
  await expect(introText).toBeVisible();
}

export async function waitForExerciseRunningPhase(page: Page): Promise<void> {
  const timer = page.locator(TestData.selectors.timer);
  
  await expect(timer).toBeVisible({ timeout: TIMEOUTS.EXERCISE_CYCLE_START });
  await expect(timer).not.toBeEmpty();
}

export async function waitForElementReady(page: Page, selector: string, timeout?: number): Promise<void> {
  const element = page.locator(selector);
  const waitTimeout = timeout ?? TIMEOUTS.NAVIGATION;
  await element.waitFor({ state: 'visible', timeout: waitTimeout });
  await element.waitFor({ state: 'attached', timeout: waitTimeout });
}

/**
 * Asserts that the page is on the home page URL.
 * Handles the case where the URL may or may not include the showquickescape query parameter
 * (it may be stripped by consent redirects)
 * 
 * @param page - The Playwright page object
 */
export async function expectHomePageURL(page: Page): Promise<void> {
  await expect(page).toHaveURL(/\/(?:\?showquickescape=false)?$/);
}

import { Page, expect } from '@playwright/test';
import TestData from './testData';
import { TIMEOUTS } from './testConstants';

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
    }
  } catch {
    // Cookie banner may not be present
  }
}

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

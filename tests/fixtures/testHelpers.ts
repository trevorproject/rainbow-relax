import { Page } from '@playwright/test';
import TestData from './testData';
import { BreathingExercisePage } from '../page-objects';

type TestDataWithUrls = typeof TestData & {
  urls?: { breathingExercise?: string };
};

const td = TestData as TestDataWithUrls;

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

export async function closeSoundControlPanel(page: Page): Promise<void> {
  const container = page.getByTestId('sound-control-container');
  await container.waitFor({ state: 'visible', timeout: 5000 });

  const box = await container.boundingBox();
  if (!box) throw new Error('Cannot get boundingBox from sound-control-container');

  const clickX = Math.max(box.x - 20, 0);
  const clickY = Math.max(box.y - 20, 0);
  await page.mouse.click(clickX, clickY);
}

export async function setupExercisePage(page: Page): Promise<{ exercisePage: BreathingExercisePage }> {
  const breathingUrl = td.urls?.breathingExercise ?? '/breathing?showquickescape=false';

  await page.addInitScript(() => {
    document.cookie = `cookie1=true; path=/; SameSite=Lax`;
  });

  await page.goto(breathingUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('domcontentloaded');

  await closeQuickEscapeModal(page);
  await acceptCookieIfExist(page).catch(() => {});

  return { exercisePage: new BreathingExercisePage(page) };
}

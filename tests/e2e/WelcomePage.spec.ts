import { test, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { HomePage, BreathingExercisePage } from '../page-objects';
import en from '../../src/i18n/en';
import es from '../../src/i18n/es';

async function bypassCookieConsent(page: any): Promise<void> {
  await page.addInitScript(() => {
    document.cookie = `cookie1=true; path=/; SameSite=Lax`;
  });
}

async function acceptCookieIfExist(page: any): Promise<void> {
  const banners = page.locator('.CookieConsent:visible');

  for (let i = 0; i < 5; i++) {
    const count = await banners.count();
    if (count === 0) return;

    const accept = banners
      .first()
      .getByRole('button', { name: /(accept|aceptar)/i })
      .first();

    if (await accept.isVisible().catch(() => false)) {
      await accept.click().catch(() => {});
    } else {
      const acceptByText = banners
        .first()
        .locator('button', { hasText: /(accept|aceptar)/i })
        .first();

      if (await acceptByText.isVisible().catch(() => false)) {
        await acceptByText.click().catch(() => {});
      } else {
        return;
      }
    }

    await page.waitForTimeout(150);
    if ((await page.locator('.CookieConsent:visible').count()) === 0) return;
  }

  await page
    .locator('.CookieConsent:visible')
    .first()
    .waitFor({ state: 'hidden', timeout: 3000 })
    .catch(() => {});
}

test.describe('WelcomePage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await bypassCookieConsent(page);

    homePage = new HomePage(page);
    await page.goto('/?showquickescape=false', { waitUntil: 'domcontentloaded' });

    await acceptCookieIfExist(page).catch(() => {});
  });

  test.describe('Info Button Functionality', () => {
    test('should display info button with correct text', async () => {
      await expect(homePage.infoButton).toBeVisible();
      await expect(homePage.infoButton).toHaveText('i');
    });

    test('should show tooltip on info button hover', async () => {
      await homePage.hoverInfoButton();

      const title = await homePage.getInfoButtonTitle();
      expect(title).toBeTruthy();
      expect(title!.length).toBeGreaterThan(10);
    });

    test('should toggle info text visibility when clicked', async ({ page }) => {
      await expect(homePage.infoText).toHaveClass(/hidden/);

      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');
      await expect(homePage.infoText).toHaveClass(/visible/);

      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');
      await expect(homePage.infoText).toHaveClass(/hidden/);
    });

    test('should display explanation text in English', async ({ page }) => {
      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');

      await expect(homePage.infoText).toHaveClass(/visible/, { timeout: 10_000 });

      const text = await homePage.getInfoTextContent();
      expect(text).toBe(en.Explanation478);
    });

    test('should display explanation text in Spanish when language is switched', async ({ page }) => {
      await homePage.switchLanguage('ES');
      await acceptCookieIfExist(page).catch(() => {});
      await expect(homePage.donateTextEs).toBeVisible({ timeout: 10_000 });

      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');

      await expect(homePage.infoText).toHaveClass(/visible/, { timeout: 10_000 });

      const text = await homePage.getInfoTextContent();
      expect(text).toBe(es.Explanation478);
    });

    test('should maintain info button functionality across language switches', async ({ page }) => {
      await expect(homePage.infoButton).toBeVisible({ timeout: 10_000 });

      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');
      await expect(homePage.infoText).toHaveClass(/visible/, { timeout: 10_000 });

      await homePage.switchLanguage('ES');
      await acceptCookieIfExist(page).catch(() => {});
      await expect(homePage.infoButton).toBeVisible({ timeout: 10_000 });
      await expect(homePage.donateTextEs).toBeVisible({ timeout: 10_000 });
      await expect(homePage.infoText).toHaveClass(/visible/, { timeout: 10_000 });

      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');
      await expect(homePage.infoText).toHaveClass(/hidden/, { timeout: 10_000 });

      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');
      await expect(homePage.infoText).toHaveClass(/visible/, { timeout: 10_000 });
    });
  });

  test.describe('Homepage Navigation', () => {
    test('should navigate to homepage when logo is clicked', async ({ page }) => {
      await expect(homePage.logo).toBeVisible();

      const homepageUrl = await page.evaluate(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const customHomeUrl = urlParams.get('homeUrl');

        if (customHomeUrl && customHomeUrl !== 'no') {
          return customHomeUrl;
        }
        return 'https://www.thetrevorproject.org/';
      });

      const expectedUrl = en['homepage-url'] as string;
      expect(homepageUrl).toBe(expectedUrl);

      const logoParent = page.locator('.Logo').locator('..');
      const cursorStyle = await logoParent.evaluate((el) => window.getComputedStyle(el).cursor);
      expect(cursorStyle).toBe('pointer');
    });

    test('should navigate to correct homepage URL in Spanish', async ({ page }) => {
      await homePage.switchLanguage('ES');
      await acceptCookieIfExist(page).catch(() => {});
      await expect(homePage.donateTextEs).toBeVisible({ timeout: 10_000 });

      await expect(homePage.logo).toBeVisible();

      const homepageUrl = await page.evaluate(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const customHomeUrl = urlParams.get('homeUrl');

        if (customHomeUrl === 'no') {
          return null;
        }
        if (customHomeUrl) {
          return customHomeUrl;
        }
        return 'https://www.thetrevorproject.mx/';
      });

      const expectedUrl = es['homepage-url'] as string;
      expect(homepageUrl).toBe(expectedUrl);

      const logoParent = page.locator('.Logo').locator('..');
      const cursorStyle = await logoParent.evaluate((el) => window.getComputedStyle(el).cursor);
      expect(cursorStyle).toBe('pointer');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display info button correctly on mobile', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.mobile);

      await expect(homePage.infoButton).toBeVisible();
      await expect(homePage.infoButton).toHaveText('i');
    });

    test('should display info button correctly on tablet', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.tablet);

      await expect(homePage.infoButton).toBeVisible();
      await expect(homePage.infoButton).toHaveText('i');
    });

    test('should display info button correctly on desktop', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.desktop);

      await expect(homePage.infoButton).toBeVisible();
      await expect(homePage.infoButton).toHaveText('i');
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper button role and accessibility attributes', async () => {
      await expect(homePage.infoButton).toHaveAttribute('title');
      await expect(homePage.infoButton).toHaveAttribute('id', 'infoButton');

      await homePage.infoButton.focus();
      await expect(homePage.infoButton).toBeFocused();
    });

    test('should be keyboard accessible', async ({ page }) => {
      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');

      await expect(homePage.infoText).toHaveClass(/visible/);
    });
  });

  test.describe('Sound Control', () => {
    test('should display sound control button on welcome page', async () => {
      await expect(homePage.soundControlButton).toBeVisible({ timeout: 10_000 });
    });

    test('should open sound control panel when sound button is clicked', async ({ page }) => {
      await expect(homePage.soundControlButton).toBeVisible({ timeout: 10_000 });

      await homePage.openSoundControlPanel();

      const exercisePage = new BreathingExercisePage(page);
      await expect(exercisePage.soundPanelTitle).toBeVisible();
    });

    test('should toggle individual sound controls on welcome page', async () => {
      await expect(homePage.soundControlButton).toBeVisible({ timeout: 10_000 });

      await homePage.openSoundControlPanel();

      await expect(homePage.backgroundToggle).toBeVisible();

      const initialChecked = await homePage.backgroundToggle.getAttribute('aria-checked');
      expect(initialChecked).not.toBeNull();

      await homePage.backgroundToggle.click();

      await expect(homePage.backgroundToggle).not.toHaveAttribute('aria-checked', initialChecked!);
    });
  });
});

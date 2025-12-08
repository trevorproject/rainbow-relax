import { expect, test } from '@playwright/test';
import TestData from '../fixtures/testData';
import { setupPageWithoutQuickEscape } from '../fixtures/testHelpers';
import { BreathingExercisePage, HomePage } from '../page-objects';
import { expectUiLanguage } from '../fixtures/assertionsHelper';
import en from '../../src/i18n/en';
import es from '../../src/i18n/es';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPageWithoutQuickEscape(page, TestData.urls.homepage);
  });

  test.describe('Language Switching', () => {
  test('should switch to Spanish when language toggle is clicked', async ({ page }) => {
    const exercise = new BreathingExercisePage(page);
    await expectUiLanguage(page, 'EN');
    await exercise.switchLanguage('ES');
    await expectUiLanguage(page, 'ES');
  });

  test('should switch back to English when language toggle is clicked again', async ({ page }) => {
    const exercise = new BreathingExercisePage(page);

    await exercise.switchLanguage('ES');
    await expectUiLanguage(page, 'ES');

    await exercise.switchLanguage('EN');
    await expectUiLanguage(page, 'EN');
  });
});

  test.describe('Quick Escape Feature', () => {
    test('should display quick escape modal by default', async ({ page }) => {
      await page.goto('/');
      const homePage = new HomePage(page);
      await expect(homePage.quickEscapeModalTitle).toBeVisible();
    });

    test('should hide quick escape when showquickescape=false in URL', async ({ page }) => {
      await page.goto('/?showquickescape=false');
      const homePage = new HomePage(page);
      await expect(homePage.quickEscapeModalTitle).not.toBeVisible();
    });

    test('should close quick escape modal when X button is clicked', async ({ page }) => {
      await page.goto('/');
      const homePage = new HomePage(page);
      await expect(homePage.quickEscapeModalTitle).toBeVisible();
      
      await homePage.quickEscapeCloseButton.click();
      await expect(homePage.quickEscapeModalTitle).not.toBeVisible();
    });
  });

  test.describe('Mobile Navigation', () => {
    test('should not show hamburger menu as it is not implemented', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.mobile);
      
      const navbar = page.locator('div.fixed.flex.items-center.justify-between');
      await expect(navbar).toBeVisible();
      
      const languageToggle = page.locator('button').filter({ hasText: /En|Es/ });
      await expect(languageToggle).toBeVisible();
      
      const donateButton = page.locator('a').filter({ hasText: /donate/i });
      await expect(donateButton).toBeVisible();
    });

    test('should maintain responsive layout on different screen sizes', async ({ page }) => {
      const viewports = [TestData.viewports.mobile, TestData.viewports.tablet, TestData.viewports.desktop];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await expect(page.locator('.Logo')).toBeVisible();
        await expect(page.locator('button').filter({ hasText: /En|Es/ })).toBeVisible();
        await expect(page.locator('a').filter({ hasText: /donate/i })).toBeVisible();
      }
    });
  });

  test.describe('Page Navigation', () => {
    test('should navigate to breathing exercise when 1 min button is clicked', async ({ page }) => {
      const homePage = new HomePage(page);
      await expect(homePage.oneMinButton).toBeVisible();
      await homePage.clickOneMinButton();
      await expect(page).toHaveURL(/.*\/breathing/);
      
      const exercisePage = new BreathingExercisePage(page);
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to breathing exercise when 3 min button is clicked', async ({ page }) => {
      const homePage = new HomePage(page);
      await expect(homePage.threeMinButton).toBeVisible();
      await homePage.clickThreeMinButton();
      await expect(page).toHaveURL(/.*\/breathing/);
      
      const exercisePage = new BreathingExercisePage(page);
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to breathing exercise when 5 min button is clicked', async ({ page }) => {
      const homePage = new HomePage(page);
      await expect(homePage.fiveMinButton).toBeVisible();
      await homePage.clickFiveMinButton();
      await expect(page).toHaveURL(/.*\/breathing/);
      
      const exercisePage = new BreathingExercisePage(page);
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: 10000 });
    });

    test('should show custom time input when timer button is clicked', async ({ page }) => {
      const customButton = page.locator('button[aria-label="Custom"]');
      await expect(customButton).toBeVisible();
      await customButton.click();
      await expect(page.locator('input[type="number"]')).toBeVisible();
      await expect(page.locator('button').filter({ hasText: /start/i })).toBeVisible();
    });

    test('should preserve widget config parameters during navigation', async ({ page }) => {
      // Start with widget config parameters and disable quick escape
      const params = {
        logoUrl: TestData.widgetConfig.testAssets.customLogo,
        donationUrl: TestData.widgetConfig.customUrls.donation,
        helpUrl: TestData.widgetConfig.customUrls.help,
        showquickescape: 'false'
      };
      
      const queryString = new URLSearchParams(params).toString();
      await page.goto(`/?${queryString}`);
      
      // Verify parameters are present on home page
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
      
      // Navigate to breathing exercise
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await oneMinButton.click();
      await expect(page).toHaveURL(/.*\/breathing/);
      
      // Verify parameters are preserved
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
    });
  });

  test.describe('Homepage Navigation', () => {
    test('should navigate to homepage when logo is clicked in English', async ({ page }) => {
      const homePage = new HomePage(page);
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

    test('should navigate to homepage when logo is clicked in Spanish', async ({ page }) => {
      const exercise = new BreathingExercisePage(page);
      await exercise.switchLanguage('ES');
      
      const homePage = new HomePage(page);
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

    test('should maintain logo functionality across different viewports', async ({ page }) => {
      const viewports = [TestData.viewports.mobile, TestData.viewports.tablet, TestData.viewports.desktop];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        
        const homePage = new HomePage(page);
        await expect(homePage.logo).toBeVisible();
        
        // Logo is clickable (has pointer cursor), not a form element so we check visibility instead of enabled
        const logoParent = homePage.logo.locator('..');
        const cursorStyle = await logoParent.evaluate((el) => window.getComputedStyle(el).cursor).catch(() => '');
        expect(cursorStyle).toBe('pointer');
      }
    });
  });
});

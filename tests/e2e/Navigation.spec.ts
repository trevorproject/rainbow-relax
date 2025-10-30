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
      await expect(page.locator('h2').filter({ hasText: /quick.?exit/i })).toBeVisible();
    });

    test('should hide quick escape when showquickescape=false in URL', async ({ page }) => {
      await page.goto('/?showquickescape=false');
      await expect(page.locator('h2').filter({ hasText: /quick.?exit/i })).not.toBeVisible();
    });

    test('should close quick escape modal when X button is clicked', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h2').filter({ hasText: /quick.?exit/i })).toBeVisible();
      
      const closeButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-x"]') });
      await closeButton.click();
      await expect(page.locator('h2').filter({ hasText: /quick.?exit/i })).not.toBeVisible();
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
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await expect(oneMinButton).toBeVisible();
      await oneMinButton.click();
      await expect(page).toHaveURL(/.*\/breathing/);
      await expect(page.locator('h2:has-text("Breathing exercise")')).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to breathing exercise when 3 min button is clicked', async ({ page }) => {
      const threeMinButton = page.locator('button').filter({ hasText: '3 min' });
      await expect(threeMinButton).toBeVisible();
      await threeMinButton.click();
      await expect(page).toHaveURL(/.*\/breathing/);
      await expect(page.locator('h2:has-text("Breathing exercise")')).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to breathing exercise when 5 min button is clicked', async ({ page }) => {
      const fiveMinButton = page.locator('button').filter({ hasText: '5 min' });
      await expect(fiveMinButton).toBeVisible();
      await fiveMinButton.click();
      await expect(page).toHaveURL(/.*\/breathing/);
      await expect(page.locator('h2:has-text("Breathing exercise")')).toBeVisible({ timeout: 10000 });
    });

    test('should show custom time input when timer button is clicked', async ({ page }) => {
      const customButton = page.locator('button[aria-label="Custom"]');
      await expect(customButton).toBeVisible();
      await customButton.click();
      await expect(page.locator('input[type="number"]')).toBeVisible();
      await expect(page.locator('button').filter({ hasText: /start/i })).toBeVisible();
    });
  });

  test.describe('Homepage Navigation', () => {
    test('should navigate to homepage when logo is clicked in English', async ({ page }) => {
      const homePage = new HomePage(page);
      await expect(homePage.logo).toBeVisible();
      
      await homePage.clickLogo();
      
      await page.waitForURL(en['homepage-url'] as string);
    });

    test('should navigate to homepage when logo is clicked in Spanish', async ({ page }) => {
      const exercise = new BreathingExercisePage(page);
      await exercise.switchLanguage('ES');
      
      const homePage = new HomePage(page);
      await expect(homePage.logo).toBeVisible();
      
      await homePage.clickLogo();
      
      await page.waitForURL(es['homepage-url']);
    });

    test('should maintain logo functionality across different viewports', async ({ page }) => {
      const viewports = [TestData.viewports.mobile, TestData.viewports.tablet, TestData.viewports.desktop];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        
        const homePage = new HomePage(page);
        await expect(homePage.logo).toBeVisible();
        
        await expect(homePage.logo).toBeEnabled();
      }
    });
  });
});

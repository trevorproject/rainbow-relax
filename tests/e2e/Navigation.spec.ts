import { expect, test } from '@playwright/test';
import TestData from '../fixtures/testData';
import { setupPageWithoutQuickEscape } from '../fixtures/testHelpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPageWithoutQuickEscape(page, TestData.urls.homepage);
  });

  test.describe('Language Switching', () => {
    test('should switch to Spanish when language toggle is clicked', async ({ page }) => {
      const languageToggle = page.locator('button').filter({ hasText: 'En' });
      await expect(languageToggle).toBeVisible();
      await expect(page.locator('text="Donate"')).toBeVisible();
      
      await languageToggle.click();
      
      const spanishToggle = page.locator('button').filter({ hasText: 'Es' });
      await expect(spanishToggle).toBeVisible();
      await expect(page.locator('text="Donar"')).toBeVisible();
    });

    test('should switch back to English when language toggle is clicked again', async ({ page }) => {
      const languageToggle = page.locator('button').filter({ hasText: 'En' });
      await languageToggle.click();
      
      const spanishToggle = page.locator('button').filter({ hasText: 'Es' });
      await expect(spanishToggle).toBeVisible();
      await expect(page.locator('text="Donar"')).toBeVisible();
      
      await spanishToggle.click();
      
      const englishToggle = page.locator('button').filter({ hasText: 'En' });
      await expect(englishToggle).toBeVisible();
      await expect(page.locator('text="Donate"')).toBeVisible();
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
      
      // Updated selector to use the actual navbar class
      const navbar = page.locator('div.rr-navbar');
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
      
      // Check for breathing exercise interface instead of URL change
      await expect(page.locator('h1').filter({ hasText: /4-7-8/i })).toBeVisible();
    });

    test('should navigate to breathing exercise when 3 min button is clicked', async ({ page }) => {
      const threeMinButton = page.locator('button').filter({ hasText: '3 min' });
      await expect(threeMinButton).toBeVisible();
      await threeMinButton.click();
      
      // Check for breathing exercise interface instead of URL change
      await expect(page.locator('h1').filter({ hasText: /4-7-8/i })).toBeVisible();
    });

    test('should navigate to breathing exercise when 5 min button is clicked', async ({ page }) => {
      const fiveMinButton = page.locator('button').filter({ hasText: '5 min' });
      await expect(fiveMinButton).toBeVisible();
      await fiveMinButton.click();
      
      // Check for breathing exercise interface instead of URL change
      await expect(page.locator('h1').filter({ hasText: /4-7-8/i })).toBeVisible();
    });

    test('should show custom time input when timer button is clicked', async ({ page }) => {
      const customButton = page.locator('button[aria-label="Custom"]');
      await expect(customButton).toBeVisible();
      await customButton.click();
      await expect(page.locator('input[type="number"]')).toBeVisible();
      await expect(page.locator('button').filter({ hasText: /start/i })).toBeVisible();
    });
  });
});

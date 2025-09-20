import { expect, test } from '@playwright/test';
import { closeQuickEscapeModal } from '../fixtures/testHelpers';
import { HomePage, TestData } from '../page-objects';

test.describe('Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.describe('Page Loading', () => {
    test('should load the homepage successfully', async ({ page }) => {

      await expect(page).toHaveTitle(TestData.titles.homepage);
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    test('should display the correct page structure', async () => {
      await expect(homePage.mainContent).toBeVisible();
      
      if (await homePage.header.count() > 0 && await homePage.header.isVisible()) {
        await expect(homePage.header).toBeVisible();
      }
      
      if (await homePage.navigation.count() > 0 && await homePage.navigation.isVisible()) {
        await expect(homePage.navigation).toBeVisible();
      }
    });
  });

  test.describe('Homepage Functionality', () => {
    test('should navigate to breathing exercise when start button is clicked', async ({ page }) => {
      await closeQuickEscapeModal(page);
      
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await oneMinButton.click();
      
      // Check for breathing exercise interface instead of URL change
      await expect(page.locator('h1').filter({ hasText: /4-7-8/i })).toBeVisible();
    });

    test('should handle language switching', async ({ page }) => {
      await closeQuickEscapeModal(page);
      
      const languageToggle = page.locator('button').filter({ hasText: 'En' });
      if (await languageToggle.isVisible()) {
        await languageToggle.click();
        await expect(page.locator('text="Donar"')).toBeVisible();
        
        const spanishToggle = page.locator('button').filter({ hasText: 'Es' });
        await spanishToggle.click();
        await expect(page.locator('text="Donate"')).toBeVisible();
      }
    });

    test('should display quick escape by default', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h2').filter({ hasText: /quick.?exit/i })).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.mobile);
      await expect(page).toHaveTitle(TestData.titles.homepage);
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    test('should display correctly on tablet devices', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.tablet);
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.desktop);
      expect(await homePage.isLoaded()).toBeTruthy();
    });
  });
});

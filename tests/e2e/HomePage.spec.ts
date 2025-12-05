import { test, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { closeQuickEscapeModal } from '../fixtures/testHelpers';
import { HomePage, BreathingExercisePage } from '../page-objects';
import { expectUiLanguage } from '../fixtures/assertionsHelper';

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
      await homePage.closeQuickEscapeModal();
      
      await homePage.clickOneMinButton();
      await expect(page).toHaveURL(/.*breathing.*/);
      
      const exercisePage = new BreathingExercisePage(page);
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: 10000 });
    });

    test('should handle language switching', async ({ page }) => {
      await closeQuickEscapeModal(page);
  
      // Visible En
      await expectUiLanguage(page, 'EN');

      // Change to Es and Verify
      await homePage.switchLanguage('ES');
      await expectUiLanguage(page, 'ES');

      // Change to En and Verify
      await homePage.switchLanguage('EN');
      await expectUiLanguage(page, 'EN');

});

    test('should display quick escape by default', async ({ page }) => {
      await page.goto('/');
      const homePage = new HomePage(page);
      await expect(homePage.quickEscapeModalTitle).toBeVisible();
    });

    test('should navigate to correct donate page in Spanish', async ({ page }) => {
      await homePage.closeQuickEscapeModal();
      
      await homePage.switchLanguage('ES');
      
      // Wait for language switch to complete - check for Spanish text
      await expect(homePage.donateTextEs).toBeVisible({ timeout: 10000 });
      
      const [newPageEs] = await Promise.all([
        page.waitForEvent('popup', { timeout: 15000 }),
        homePage.donateButtonEs.click({ timeout: 15000 }),
      ]);
      // Wait for page to load - use domcontentloaded instead of networkidle for external sites
      // External sites often have continuous network activity (analytics, ads) so networkidle never fires
      await newPageEs.waitForLoadState('domcontentloaded', { timeout: 15000 });
      await newPageEs.waitForURL('https://www.thetrevorproject.mx/dona/', { timeout: 15000 });
      await expect(newPageEs).toHaveURL('https://www.thetrevorproject.mx/dona/');
    });

    test('should go to correct donate page in English', async ({ page }) => {
        await homePage.closeQuickEscapeModal();
        
        await expect(homePage.donateTextEn).toBeVisible();
        
        const [newPageEn] = await Promise.all([
          page.waitForEvent('popup', { timeout: 15000 }),
          homePage.donateButtonEn.click({ timeout: 15000 }),
        ]);
        // Wait for page to load - use domcontentloaded instead of networkidle for external sites
        await newPageEn.waitForLoadState('domcontentloaded', { timeout: 15000 });
        await newPageEn.waitForURL('https://give.thetrevorproject.org/campaign/716635/donate', { timeout: 15000 });
        await expect(newPageEn).toHaveURL('https://give.thetrevorproject.org/campaign/716635/donate');
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
});

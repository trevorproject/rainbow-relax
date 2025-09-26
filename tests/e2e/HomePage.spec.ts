import { test, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { closeQuickEscapeModal } from '../fixtures/testHelpers';
import { HomePage } from '../page-objects';
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
      await closeQuickEscapeModal(page);
      
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await oneMinButton.click();
      await expect(page).toHaveURL(/.*breathing.*/);
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
      await expect(page.locator('h2').filter({ hasText: /quick.?exit/i })).toBeVisible();
    });

    test('should navigate to correct donate page in Spanish', async ({ page }) => {

      const languageToggle = page.locator('button').filter({ hasText: 'En' });
      const DonateButtonEs = page.getByRole ('link').filter({hasText: 'Donar'});
      
      await closeQuickEscapeModal(page);
        await languageToggle.click();
        await expect(page.locator('text="Donar"')).toBeVisible();
        const [newPageEs] = await Promise.all([
        page.waitForEvent('popup'),
        DonateButtonEs.click(),
        ]);
        await newPageEs.waitForLoadState();
        await newPageEs.waitForURL('https://www.thetrevorproject.mx/dona/');
        await expect(newPageEs).toHaveURL('https://www.thetrevorproject.mx/dona/');
    });

    test('should go to correct donate page in English', async ({ page }) => {

        const DonateButtonEn = page.getByRole ('link').filter({hasText: 'Donate'});
        
        await closeQuickEscapeModal(page);
        await expect(page.locator('text="Donate"')).toBeVisible();
        const [newPageEn] = await Promise.all([
        page.waitForEvent('popup'),
        DonateButtonEn.click(),
        ]);
        await newPageEn.waitForLoadState();
        await newPageEn.waitForURL('https://give.thetrevorproject.org/campaign/716635/donate');
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

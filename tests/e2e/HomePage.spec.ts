import { test, expect } from '@playwright/test';
import { WidgetSelectors } from '../fixtures/testHelpers';
import { setupWidgetTests } from '../setup/widget-validation';

test.describe('Homepage', () => {
  setupWidgetTests();

  test.describe('Widget Loading', () => {
    test('should load widget container', async ({ page }) => {
      await expect(page.locator(WidgetSelectors.widgetContainer)).toBeVisible();
    });

    test('should display start exercise buttons', async ({ page }) => {
      await page.waitForSelector(WidgetSelectors.startButton1Min, { timeout: 10000 });
      await expect(page.locator(WidgetSelectors.startButton1Min)).toBeVisible();
      await expect(page.locator(WidgetSelectors.startButton3Min)).toBeVisible();
      await expect(page.locator(WidgetSelectors.startButton5Min)).toBeVisible();
    });

    test('should have language toggle', async ({ page }) => {
      await page.waitForSelector(WidgetSelectors.languageToggle, { timeout: 10000 });
      await expect(page.locator(WidgetSelectors.languageToggle)).toBeVisible();
    });
  });

  test.describe('Widget Functionality', () => {
    test('should navigate to breathing exercise when start button is clicked', async ({ page }) => {
      await page.waitForSelector(WidgetSelectors.startButton1Min, { timeout: 10000 });
      await page.locator(WidgetSelectors.startButton1Min).click();
      await expect(page.locator(WidgetSelectors.breathingInstructions)).toBeVisible();
    });

    test('should handle language switching', async ({ page }) => {
      const languageToggle = page.locator(WidgetSelectors.languageToggle);
      if (await languageToggle.isVisible()) {
        await languageToggle.click();
        await expect(page.locator('text="Donar"')).toBeVisible();
        
        await languageToggle.click();
        await expect(page.locator('text="Donate"')).toBeVisible();
      }
    });

    test('should navigate to correct donate page in Spanish', async ({ page }) => {
      const languageToggle = page.locator(WidgetSelectors.languageToggle);
      const donateButton = page.locator(WidgetSelectors.donateButton);
      
      await languageToggle.click();
      await expect(page.locator('text="Donar"')).toBeVisible();
      
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        donateButton.click(),
      ]);
      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL('https://www.thetrevorproject.mx/dona/');
    });

    test('should go to correct donate page in English', async ({ page }) => {
      const donateButton = page.locator(WidgetSelectors.donateButton);
      
      await expect(page.locator('text="Donate"')).toBeVisible();
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        donateButton.click(),
      ]);
      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL('https://give.thetrevorproject.org/campaign/716635/donate');
    });
  });
});

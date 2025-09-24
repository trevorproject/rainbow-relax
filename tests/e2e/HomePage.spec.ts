import { test, expect } from '@playwright/test';
import { WidgetSelectors } from '../fixtures/testHelpers';
import { setupWidgetTests } from '../setup/widget-validation';

test.describe('Homepage', () => {
  setupWidgetTests();

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

  test('should navigate to breathing exercise when start button is clicked', async ({ page }) => {
    await page.waitForSelector(WidgetSelectors.startButton1Min, { timeout: 10000 });
    await page.locator(WidgetSelectors.startButton1Min).click();
    await expect(page.locator(WidgetSelectors.breathingInstructions)).toBeVisible();
  });
});

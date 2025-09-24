import { test, expect } from '@playwright/test';
import { WidgetSelectors } from '../fixtures/testHelpers';
import { setupWidgetTests } from '../setup/widget-validation';

test.describe('Breathing Exercise', () => {
  setupWidgetTests();

  test.beforeEach(async ({ page }) => {
    await page.waitForSelector(WidgetSelectors.startButton1Min, { timeout: 10000 });
    await page.locator(WidgetSelectors.startButton1Min).click();
  });

  test('should display breathing exercise interface', async ({ page }) => {
    await expect(page.locator(WidgetSelectors.breathingInstructions)).toBeVisible();
  });

  test('should have back button', async ({ page }) => {
    await expect(page.locator(WidgetSelectors.backButton)).toBeVisible();
  });

  test('should navigate back when back button is clicked', async ({ page }) => {
    await page.locator(WidgetSelectors.backButton).click();
    await expect(page.locator(WidgetSelectors.welcomePage)).toBeVisible();
  });
});

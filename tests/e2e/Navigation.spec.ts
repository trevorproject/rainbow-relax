import { test, expect } from '@playwright/test';
import { WidgetSelectors } from '../fixtures/testHelpers';
import { setupWidgetTests } from '../setup/widget-validation';

test.describe('Navigation', () => {
  setupWidgetTests();

  test('should switch language when toggle is clicked', async ({ page }) => {
    await page.waitForSelector(WidgetSelectors.languageToggle, { timeout: 10000 });
    await page.locator(WidgetSelectors.languageToggle).click();
    await expect(page.locator('text="Donar"')).toBeVisible();
  });

  test('should navigate to breathing exercise when start button is clicked', async ({ page }) => {
    await page.waitForSelector(WidgetSelectors.startButton1Min, { timeout: 10000 });
    await page.locator(WidgetSelectors.startButton1Min).click();
    await expect(page.locator(WidgetSelectors.breathingInstructions)).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { setupWidgetTests } from '../setup/widget-validation';

test.describe('Widget Core Functionality', () => {
  setupWidgetTests();

  test('should load widget container', async ({ page }) => {
    await expect(page.locator('#rainbow-relax-container')).toBeVisible();
  });

  test('should load widget script', async ({ page }) => {
    const widgetScriptLoaded = await page.evaluate(() => {
      return typeof window.MyWidget !== 'undefined';
    });
    expect(widgetScriptLoaded).toBe(true);
  });

  test('should render widget content', async ({ page }) => {
    await page.waitForSelector('#rainbow-relax-container', { timeout: 10000 });
    
    const widgetRendered = await page.evaluate(() => {
      const container = document.getElementById('rainbow-relax-container');
      return container && container.children.length > 0;
    });
    
    expect(widgetRendered).toBe(true);
  });

  test('should display welcome page elements', async ({ page }) => {
    await page.waitForSelector('[data-testid="welcome-page"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="welcome-page"]')).toBeVisible();
  });

  test('should have start exercise buttons', async ({ page }) => {
    await page.waitForSelector('[data-testid="start-exercise-button-1min"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="start-exercise-button-1min"]')).toBeVisible();
    await expect(page.locator('[data-testid="start-exercise-button-3min"]')).toBeVisible();
    await expect(page.locator('[data-testid="start-exercise-button-5min"]')).toBeVisible();
  });

  test('should have language toggle', async ({ page }) => {
    await page.waitForSelector('[data-testid="language-toggle"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="language-toggle"]')).toBeVisible();
  });

  test('should have navbar with logo and donate button', async ({ page }) => {
    await page.waitForSelector('[data-testid="navbar"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="navbar"]')).toBeVisible();
    await expect(page.locator('[data-testid="donate-button"]')).toBeVisible();
  });
});


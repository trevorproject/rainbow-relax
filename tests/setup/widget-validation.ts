import { test, expect } from '@playwright/test';

export let widgetScriptLoaded = false;
export let widgetRendered = false;

export async function validateWidget(browser: any) {
  const page = await browser.newPage();
  
  try {
    await page.goto('/widget-test.html');
    await page.waitForLoadState('networkidle');
    
    // Wait for widget script to load
    await page.waitForFunction(() => typeof window.MyWidget !== 'undefined', { timeout: 10000 });
    
    // Check if widget script is loaded
    widgetScriptLoaded = await page.evaluate(() => {
      return typeof window.MyWidget !== 'undefined';
    });
    
    if (!widgetScriptLoaded) {
      throw new Error('Widget script failed to load - stopping all tests');
    }
    
    // Check if widget is rendered
    await page.waitForSelector('#rainbow-relax-container', { timeout: 10000 });
    
    widgetRendered = await page.evaluate(() => {
      const container = document.getElementById('rainbow-relax-container');
      return container && container.children.length > 0;
    });
    
    if (!widgetRendered) {
      throw new Error('Widget failed to render - stopping all tests');
    }
    
    console.log('✅ Widget validation passed - script loaded and rendered');
    
  } catch (error) {
    console.error('❌ Widget validation failed:', error);
    throw error;
  } finally {
    await page.close();
  }
}

export function setupWidgetTests() {
  test.beforeAll(async ({ browser }) => {
    await validateWidget(browser);
  });

  test.beforeEach(async ({ page }) => {
    if (!widgetScriptLoaded || !widgetRendered) {
      test.skip('Widget script not loaded or not rendered');
    }
    await page.goto('/widget-test.html');
    await page.waitForLoadState('networkidle');
  });
}

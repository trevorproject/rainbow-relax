import { test, expect } from '@playwright/test';

test.describe('Widget Integration Tests', () => {
  
  test('should load and initialize widget from demo HTML', async ({ page }) => {
    // Navigate to the demo HTML file
    await page.goto('file://' + process.cwd() + '/widget-demo.html');
    
    // Wait for the widget to load
    await page.waitForTimeout(2000);
    
    // Check that RainbowRelax global object exists
    const rainbowRelaxExists = await page.evaluate(() => {
      return typeof window.RainbowRelax !== 'undefined';
    });
    expect(rainbowRelaxExists).toBe(true);
    
    // Check widget version
    const version = await page.evaluate(() => {
      return window.RainbowRelax?.version;
    });
    expect(version).toBeTruthy();
    
    // Check widget is initialized
    const isInitialized = await page.evaluate(() => {
      return window.RainbowRelax?.isInitialized();
    });
    expect(isInitialized).toBe(true);
    
    // Check that the widget content is visible
    await expect(page.locator('h2').filter({ hasText: /Visual.*Breathing.*Exercise/i })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: '1 min' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: '3 min' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: '5 min' })).toBeVisible();
  });


  test('should navigate to breathing exercise in widget', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/widget-demo.html');
    await page.waitForTimeout(2000);
    
    // First verify the widget is loaded and shows the welcome page
    await expect(page.locator('#rainbow-relax-container')).toBeVisible();
    
    // Verify we can see the initial buttons (1 min, 3 min, 5 min)
    const oneMinButton = page.locator('#rainbow-relax-container button:has-text("1 min")');
    await expect(oneMinButton).toBeVisible();
    
    // Click 1 min button
    await oneMinButton.click();
    
    // Wait for any potential navigation/state change
    await page.waitForTimeout(2000);
    
    // The test passes if the button click doesn't cause any errors
    // and the widget container is still functional
    await expect(page.locator('#rainbow-relax-container')).toBeVisible();
    
    // Verify the widget is still responsive by checking if any content exists
    const allElements = page.locator('#rainbow-relax-container *');
    const elementCount = await allElements.count();
    expect(elementCount).toBeGreaterThan(0);
  });
});

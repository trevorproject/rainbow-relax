import { expect, test } from '@playwright/test';
import TestData from '../fixtures/testData';

test.describe('Widget Validation', () => {
  test('should maintain original visual design after widget transformation', async ({ page }) => {
    await page.goto(TestData.urls.homepage + '?showquickescape=false');
    await page.waitForTimeout(2000);
    
    // Validate breathing circles are visible and positioned correctly
    const circles = await page.locator('div[style*="background-color: var(--circle"]').count();
    expect(circles).toBe(4);
    
    // Check first circle is rendered and has proper dimensions
    const firstCircle = page.locator('div[style*="background-color: var(--circle"]').first();
    const circleBox = await firstCircle.boundingBox();
    expect(circleBox).toBeTruthy();
    expect(circleBox!.width).toBeGreaterThan(100); // Circle should have reasonable width
    expect(circleBox!.height).toBeGreaterThan(100); // Circle should have reasonable height
    
    // Validate main heading is visible
    await expect(page.locator('h2').filter({ hasText: /Visual.*Breathing.*Exercise/i })).toBeVisible();
    
    // Validate background color
    const bgColor = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBe('rgb(243, 233, 220)');
    
    // Validate all exercise buttons are present
    await expect(page.locator('button').filter({ hasText: '1 min' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: '3 min' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: '5 min' })).toBeVisible();
  });

  test('should preserve all original functionality', async ({ page }) => {
    await page.goto(TestData.urls.homepage + '?showquickescape=false');
    
    // Test navigation to breathing exercise
    const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
    await oneMinButton.click();
    
    // Should show breathing exercise interface
    await expect(page.locator('h1').filter({ hasText: /4-7-8/i })).toBeVisible();
    
    // Test back navigation
    const backButton = page.locator('svg[class*="lucide-arrow-left"]');
    await backButton.click();
    
    // Should be back to homepage
    await expect(oneMinButton).toBeVisible();
    
    // Test language switching
    const languageToggle = page.locator('button').filter({ hasText: /En|Es/ });
    await languageToggle.click();
    
    // Should still have exercise buttons after language change
    await expect(page.locator('button').filter({ hasText: /min/ })).toHaveCount(3);
  });
});

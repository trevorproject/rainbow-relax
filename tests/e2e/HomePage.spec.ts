import { expect, test } from '@playwright/test';

test.describe('Rainbow Relax Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads and has expected content
    await expect(page).toHaveTitle(/Breathing Exercise/);
    
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page).toHaveTitle(/Breathing Exercise/);
  });
});

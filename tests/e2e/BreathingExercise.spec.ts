import { expect, test } from '@playwright/test';
import TestData from '../fixtures/testData';
import { setupPageWithoutQuickEscape, waitForBreathingExerciseToStart, waitForBreathingInstructions } from '../fixtures/testHelpers';

test.describe('Breathing Exercise', () => {
  test.beforeEach(async ({ page }) => {
    await setupPageWithoutQuickEscape(page, TestData.urls.homepage);
    
    const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
    await oneMinButton.click();
    await expect(page).toHaveURL(/.*\/breathing/);
  });

  test.describe('Exercise Interface', () => {
    test('should display breathing exercise introduction elements', async ({ page }) => {
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('p').filter({ hasText: /inhale.*hold.*exhale/i })).toBeVisible();
      
      const soundToggle = page.locator('svg[class*="lucide-volume"]');
      await expect(soundToggle).toBeVisible();
    });

    test('should display exercise controls during breathing', async ({ page }) => {
      await waitForBreathingExerciseToStart(page);
      await expect(page.locator('h2').filter({ hasText: /\d+:\d+/ })).toBeVisible();
      
      const pausePlayButton = page.locator('button svg[class*="lucide-pause"], button svg[class*="lucide-play"]');
      await expect(pausePlayButton).toBeVisible();
      await expect(page.locator('p').filter({ hasText: /through your nose|hold your breath|through your mouth/i })).toBeVisible();
    });

    test('should have back navigation button', async ({ page }) => {
      const backButton = page.locator('svg[class*="lucide-arrow-left"]');
      await expect(backButton).toBeVisible();
    });
  });

  test.describe('Exercise Functionality', () => {
    test('should toggle pause/play when pause button is clicked', async ({ page }) => {
      await waitForBreathingExerciseToStart(page);
      
      const pauseButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-pause"]') });
      await pauseButton.click();
      
      const playButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-play"]') });
      await expect(playButton).toBeVisible();
      await playButton.click();
      await expect(pauseButton).toBeVisible();
    });

    test('should navigate back when back button is clicked', async ({ page }) => {
      const backButton = page.locator('svg[class*="lucide-arrow-left"]');
      await backButton.click();
      await expect(page).toHaveURL('/');
    });

    test('should toggle sound when sound button is clicked', async ({ page }) => {
      const soundButton = page.locator('div.mt-8.cursor-pointer');
      const initialVolume = await page.locator('svg[class*="lucide-volume2"]').isVisible();
      
      await soundButton.click();
      
      // Wait for the volume icon state to change
      if (initialVolume) {
        await expect(page.locator('svg[class*="lucide-volume2"]')).not.toBeVisible();
      } else {
        await expect(page.locator('svg[class*="lucide-volume2"]')).toBeVisible();
      }
      
      const newVolume = await page.locator('svg[class*="lucide-volume2"]').isVisible();
      expect(newVolume).not.toBe(initialVolume);
    });
  });

  test.describe('Exercise Timing', () => {
    test('should show countdown timer during exercise', async ({ page }) => {
      await waitForBreathingExerciseToStart(page);
      
      const timer = page.locator('h2').filter({ hasText: /\d+:\d+/ });
      await expect(timer).toBeVisible();
      
      const timerText = await timer.textContent();
      expect(timerText).toMatch(/\d+:\d+/);
    });

    test('should display breathing instructions that change during exercise', async ({ page }) => {
      await waitForBreathingInstructions(page);
      
      const instructions = page.locator('p').filter({ hasText: /inhale|exhale|hold/i });
      await expect(instructions).toBeVisible();
      
      const instructionText = await instructions.textContent();
      expect(instructionText).toBeTruthy();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.mobile);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('svg[class*="lucide-arrow-left"]')).toBeVisible();
      await expect(page.locator('svg[class*="lucide-volume"]')).toBeVisible();
    });

    test('should maintain functionality on tablet', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.tablet);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('p').filter({ hasText: /inhale.*hold.*exhale/i })).toBeVisible();
    });
  });

  test.describe('Language Support', () => {
    test('should display instructions in current language', async ({ page }) => {
      const instructions = page.locator('p').filter({ hasText: /inhale.*hold.*exhale/i });
      await expect(instructions).toBeVisible();
      
      const instructionText = await instructions.textContent();
      expect(instructionText).toBeTruthy();
      expect(instructionText!.length).toBeGreaterThan(10);
    });
  });
});

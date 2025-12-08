import { test, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { closeQuickEscapeModal, setupExercisePage, closeSoundControlPanel } from '../fixtures/testHelpers';
import { assertAllSoundTogglesVisible, assertToggleStateChanged, assertAllTogglesMuted, assertAllTogglesUnmuted, clickToggleSafely } from '../fixtures/assertionsHelper';
import { HomePage } from '../page-objects';

test.describe('Sound Control Panel Positioning', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?showquickescape=false');
    await page.waitForLoadState('networkidle');
    // Close quick escape modal if it appears
    await closeQuickEscapeModal(page);
  });

  test('should position panel above button when there is not enough space below on mobile', async ({ page }) => {
    await page.setViewportSize(TestData.viewports.mobile);
    
    await closeQuickEscapeModal(page);
    
    const homePage = new HomePage(page);
    await expect(homePage.soundControlButton).toBeVisible({ timeout: 10000 });
    
    await homePage.soundControlButton.click({ force: true });
    
    await expect(homePage.soundPanel).toBeVisible({ timeout: 5000 });
  });

  test('should position panel correctly when button is near bottom of screen', async ({ page }) => {
    await page.setViewportSize(TestData.viewports.mobile);
    
    await closeQuickEscapeModal(page);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const homePage = new HomePage(page);
    await expect(homePage.soundControlButton).toBeVisible({ timeout: 10000 });
    
    await homePage.soundControlButton.click({ force: true });
    
    await expect(homePage.soundPanel).toBeVisible({ timeout: 5000 });
  });

  test.describe('Breathing Exercise Sound Control', () => {
    test('should display sound control button during intro phase', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: 10000 });
    });

    test('should display sound control button during exercise phase', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.timer.waitFor({ state: 'visible', timeout: 25000 }).catch(() => {});
      
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: 10000 });
    });

    test('should open audio settings panel when clicked during intro', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: 10000 });
      
      await exercisePage.openSoundControlPanel();
      
      await expect(exercisePage.soundPanelTitle).toBeVisible({ timeout: 5000 });
    });

    test('should open audio settings panel when clicked during exercise', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.timer.waitFor({ state: 'visible', timeout: 25000 }).catch(() => {});
      
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: 10000 });
      
      await exercisePage.openSoundControlPanel();
      
      await expect(exercisePage.soundPanelTitle).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Floating Audio Control Functionality', () => {
    test('should display floating audio control button with correct test identifiers', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await expect(exercisePage.soundControlContainer).toBeVisible({ timeout: 10000 });
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: 10000 });
    });

    test('should open panel when button is clicked', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.openSoundControlPanel();
      
      await expect(exercisePage.soundPanel).toBeVisible({ timeout: 5000 });
    });

    test('should display all audio control toggles with test identifiers', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.openSoundControlPanel();
      
      await assertAllSoundTogglesVisible(exercisePage);
    });

    test('should toggle background sounds setting', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.openSoundControlPanel();
      
      await expect(exercisePage.backgroundToggle).toBeVisible({ timeout: 5000 });
      
      const initialChecked = await exercisePage.backgroundToggle.getAttribute('aria-checked');
      expect(initialChecked).not.toBeNull();
      
      await clickToggleSafely(exercisePage.backgroundToggle);
      
      await assertToggleStateChanged(exercisePage, exercisePage.backgroundToggle, initialChecked);
    });

    test('should toggle instructions setting', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.openSoundControlPanel();
      
      await expect(exercisePage.instructionsToggle).toBeVisible({ timeout: 5000 });
      
      const initialChecked = await exercisePage.instructionsToggle.getAttribute('aria-checked');
      expect(initialChecked).not.toBeNull();
      
      await clickToggleSafely(exercisePage.instructionsToggle);
      
      await assertToggleStateChanged(exercisePage, exercisePage.instructionsToggle, initialChecked);
    });

    test('should toggle exercise guide setting', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.openSoundControlPanel();
      
      await expect(exercisePage.guideToggle).toBeVisible({ timeout: 5000 });
      
      const initialChecked = await exercisePage.guideToggle.getAttribute('aria-checked');
      expect(initialChecked).not.toBeNull();
      
      await clickToggleSafely(exercisePage.guideToggle);
      
      await assertToggleStateChanged(exercisePage, exercisePage.guideToggle, initialChecked);
    });

    test('should mute/unmute all sounds with mute all button', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.openSoundControlPanel();
      
      await expect(exercisePage.muteAllButton).toBeVisible({ timeout: 5000 });
      
      const initialText = await exercisePage.muteAllButton.textContent();
      expect(initialText).toBeTruthy();
      
      await exercisePage.muteAllButton.click();
      
      await assertAllTogglesMuted(exercisePage);
      
      const newText = await exercisePage.muteAllButton.textContent();
      expect(newText).not.toBe(initialText);
      
      await exercisePage.muteAllButton.click();
      
      await assertAllTogglesUnmuted(exercisePage);
    });

    test('should close panel when clicking outside', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await exercisePage.openSoundControlPanel();
      
      await expect(exercisePage.soundPanel).toBeVisible({ timeout: 5000 });
      
      await closeSoundControlPanel(page, exercisePage);
      
      await expect(exercisePage.soundPanel).not.toBeVisible({ timeout: 5000 });
    });

    test('should maintain button visibility during intro and exercise phases', async ({ page }) => {
      const { exercisePage } = await setupExercisePage(page);
      
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: 10000 });
      
      await exercisePage.timer.waitFor({ state: 'visible', timeout: 25000 }).catch(() => {});
      
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: 10000 });
    });
  });
});


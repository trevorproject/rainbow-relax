import {expect, Page, Locator} from '@playwright/test';
import { BreathingExercisePage } from '../page-objects';

export async function expectUiLanguage (page: Page, lang: 'EN' | 'ES'){
    //Toggle by language
    const toggle = page.getByRole('button', { name: lang === 'EN' ? /^En$/i : /^Es$/i });
    await expect(toggle).toBeVisible();
    
    // Donation link and text
    const donateName = lang === 'EN' ? /^Donate$/i : /^Donar$/i;
    await expect(page.getByRole('link', { name: donateName })).toBeVisible();

    // Logo by language
    const logo = page.getByAltText('LogoAlt');
    const suffix = lang.toLowerCase(); // 'en' | 'es'
    await expect(logo).toHaveAttribute('src', new RegExp(`TrevorLogo-${suffix}\\.svg(\\?.*)?$`, 'i'));
}

/**
 * Asserts that all sound control toggles and panel elements are visible.
 * 
 * @param exercisePage - The BreathingExercisePage instance
 */
export async function assertAllSoundTogglesVisible(exercisePage: BreathingExercisePage): Promise<void> {
  await expect(exercisePage.soundPanelTitle).toBeVisible({ timeout: 5000 });
  await expect(exercisePage.backgroundToggle).toBeVisible({ timeout: 5000 });
  await expect(exercisePage.instructionsToggle).toBeVisible({ timeout: 5000 });
  await expect(exercisePage.guideToggle).toBeVisible({ timeout: 5000 });
  await expect(exercisePage.muteAllButton).toBeVisible({ timeout: 5000 });
}

/**
 * Asserts that a toggle's state has changed from its initial value.
 * 
 * @param exercisePage - The BreathingExercisePage instance (unused but kept for API consistency)
 * @param toggleLocator - The locator for the toggle to check
 * @param initialChecked - The initial aria-checked value
 */
export async function assertToggleStateChanged(
  _exercisePage: BreathingExercisePage,
  toggleLocator: Locator,
  initialChecked: string | null
): Promise<void> {
  await expect(toggleLocator).not.toHaveAttribute('aria-checked', initialChecked!);
}

/**
 * Waits for a toggle to be actionable and then clicks it.
 * This ensures the toggle is ready for interaction after panel animations.
 * 
 * @param toggleLocator - The locator for the toggle to click
 */
export async function clickToggleSafely(toggleLocator: Locator): Promise<void> {
  await toggleLocator.waitFor({ state: 'visible', timeout: 5000 });
  await toggleLocator.waitFor({ state: 'attached', timeout: 5000 });
  // Small delay to ensure animations complete
  await toggleLocator.page().waitForTimeout(100);
  await toggleLocator.click({ timeout: 5000 });
}

/**
 * Asserts that all sound toggles are in the muted state (aria-checked='false').
 * 
 * @param exercisePage - The BreathingExercisePage instance
 */
export async function assertAllTogglesMuted(exercisePage: BreathingExercisePage): Promise<void> {
  await expect(exercisePage.backgroundToggle).toHaveAttribute('aria-checked', 'false');
  await expect(exercisePage.instructionsToggle).toHaveAttribute('aria-checked', 'false');
  await expect(exercisePage.guideToggle).toHaveAttribute('aria-checked', 'false');
}

/**
 * Asserts that all sound toggles are in the unmuted state (aria-checked='true').
 * 
 * @param exercisePage - The BreathingExercisePage instance
 */
export async function assertAllTogglesUnmuted(exercisePage: BreathingExercisePage): Promise<void> {
  await expect(exercisePage.backgroundToggle).toHaveAttribute('aria-checked', 'true');
  await expect(exercisePage.instructionsToggle).toHaveAttribute('aria-checked', 'true');
  await expect(exercisePage.guideToggle).toHaveAttribute('aria-checked', 'true');
}

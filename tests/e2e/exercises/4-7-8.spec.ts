import { test, expect } from '../../fixtures/fixtures';
import { TIMEOUTS } from '../../fixtures/testConstants';
import TestData from '../../fixtures/testData';
import { expectHomePageURL } from '../../fixtures/testHelpers';

test.describe('4-7-8 Breathing Exercise', () => {
  test('Complete exercise flow from start to running', async ({ pageObjects, homePage }) => {
    // Verify homepage is ready before starting exercise
    await expectHomePageURL(homePage);
    
    await test.step('Navigate to exercise', async () => {
      await pageObjects.homePage.clickOneMinButton();
    });

    await test.step('Verify intro phase', async () => {
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.exerciseTitle).toBeVisible();
      await expect(exercisePage.introInstructions).toBeVisible();
      await expect(exercisePage.backButton).toBeVisible();
      await expect(exercisePage.soundControlButton).toBeVisible();
    });

    await test.step('Verify running phase', async () => {
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.timer).toBeVisible({ timeout: TIMEOUTS.EXERCISE_CYCLE_START });
      await expect(exercisePage.timer).not.toBeEmpty();
      await expect(exercisePage.pauseButton).toBeVisible();
      await expect(exercisePage.instructions).toBeVisible();
      
      const timerText = await exercisePage.timer.textContent();
      expect(timerText).toMatch(/\d+:\d+/);
      
      const instructionText = await exercisePage.instructions.textContent();
      expect(instructionText).toBeTruthy();
      expect(instructionText!.length).toBeGreaterThan(0);
    });
  });

  test('Exercise controls work correctly', async ({ pageObjects, homePage }) => {
    await pageObjects.homePage.clickOneMinButton();
    
    // Wait for running phase
    const exercisePage = pageObjects.exercisePage;
    await expect(exercisePage.timer).toBeVisible({ timeout: TIMEOUTS.EXERCISE_CYCLE_START });
    await expect(exercisePage.timer).not.toBeEmpty();

    await test.step('Pause and resume', async () => {
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.pauseButton).toBeVisible({ timeout: TIMEOUTS.EXERCISE_PHASE_TRANSITION });
      await exercisePage.pauseExercise();
      await expect(exercisePage.playButton).toBeVisible({ timeout: TIMEOUTS.CLICK_ACTION });
      await exercisePage.resumeExercise();
      await expect(exercisePage.pauseButton).toBeVisible({ timeout: TIMEOUTS.CLICK_ACTION });
    });

    await test.step('Navigate back', async () => {
      const exercisePage = pageObjects.exercisePage;
      await exercisePage.navigateBack();
      await expectHomePageURL(homePage);
    });
  });

  test('Sound controls work during exercise', async ({ pageObjects, homePage }) => {
    // Verify homepage is ready before starting exercise
    await expectHomePageURL(homePage);
    
    await pageObjects.homePage.clickOneMinButton();
    
    // Wait for intro phase
    const exercisePage = pageObjects.exercisePage;
    await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });

    await test.step('Open sound panel', async () => {
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await exercisePage.openSoundControlPanel();
      await expect(exercisePage.soundPanelTitle).toBeVisible();
    });

    await test.step('Toggle sound', async () => {
      const initialState = await exercisePage.backgroundToggle.getAttribute('aria-checked');
      expect(initialState).not.toBeNull();
      await exercisePage.toggleBackgroundSounds();
      await expect(exercisePage.backgroundToggle).not.toHaveAttribute('aria-checked', initialState!);
    });
  });

  // Parameterized responsive test
  [
    { name: 'mobile', viewport: TestData.viewports.mobile },
    { name: 'tablet', viewport: TestData.viewports.tablet },
  ].forEach(({ name, viewport }) => {
    test(`Exercise works on ${name} viewport`, async ({ pageObjects, homePage }) => {
      await homePage.setViewportSize(viewport);
      await pageObjects.homePage.clickOneMinButton();
      
      // Wait for intro phase
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await expect(exercisePage.backButton).toBeVisible();
      if (name === 'mobile') {
        await expect(exercisePage.soundControlButton).toBeVisible();
      } else {
        await expect(exercisePage.introInstructions).toBeVisible();
      }
    });
  });

  // Parameterized localization test
  [
    { lang: 'EN', switchTo: null },
    { lang: 'ES', switchTo: 'ES' },
  ].forEach(({ lang, switchTo }) => {
    test(`Exercise displays correctly in ${lang}`, async ({ pageObjects, homePage: homePageFixture }) => {
      // Verify homepage is ready before starting exercise
      await expectHomePageURL(homePageFixture);
      
      const homePage = pageObjects.homePage;
      if (switchTo) await homePage.switchLanguage(switchTo as 'EN' | 'ES');
      await homePage.clickOneMinButton();
      
      // Wait for intro phase
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await expect(exercisePage.introInstructions).toBeVisible();
      const introText = await exercisePage.getIntroInstructionsText();
      expect(introText).toBeTruthy();
      expect(introText!.length).toBeGreaterThan(10);
    });
  });

});

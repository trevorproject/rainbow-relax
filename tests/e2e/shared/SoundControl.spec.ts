import { test, expect } from '../../fixtures/fixtures';
import TestData from '../../fixtures/testData';
import { TIMEOUTS } from '../../fixtures/testConstants';
import { expectHomePageURL } from '../../fixtures/testHelpers';

test.describe('Sound Control', () => {
  test('Sound control functionality on homepage', async ({ homePage, pageObjects }) => {
    await test.step('Sound control button displays', async () => {
      // Add explicit wait for page readiness
      await homePage.waitForLoadState('networkidle');
      const homePageObj = pageObjects.homePage;
      await expect(homePageObj.soundControlButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    });

    await test.step('User can open sound control panel', async () => {
      const homePageObj = pageObjects.homePage;
      await homePageObj.openSoundControlPanel();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.soundPanelTitle).toBeVisible();
    });

    await test.step('User can toggle sound controls', async () => {
      const homePageObj = pageObjects.homePage;
      await expect(homePageObj.backgroundToggle).toBeVisible();
      const initialChecked = await homePageObj.backgroundToggle.getAttribute('aria-checked');
      expect(initialChecked).not.toBeNull();
      await homePageObj.backgroundToggle.click();
      await expect(homePageObj.backgroundToggle).not.toHaveAttribute('aria-checked', initialChecked!);
    });
  });

  test('Sound control functionality during exercise', async ({ pageObjects, homePage }) => {
    // Verify homepage is ready before starting exercise
    await expectHomePageURL(homePage);
    
    await pageObjects.homePage.clickOneMinButton();
    
    // Wait for intro phase
    const exercisePage = pageObjects.exercisePage;
    await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });

    await test.step('User can open sound panel during exercise', async () => {
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.soundControlButton).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await exercisePage.openSoundControlPanel();
      await expect(exercisePage.soundPanelTitle).toBeVisible();
    });

    await test.step('User can toggle sounds during exercise', async () => {
      const exercisePage = pageObjects.exercisePage;
      const initialState = await exercisePage.backgroundToggle.getAttribute('aria-checked');
      expect(initialState).not.toBeNull();
      await exercisePage.backgroundToggle.click();
      await expect(exercisePage.backgroundToggle).not.toHaveAttribute('aria-checked', initialState!);
    });
  });

  test('Sound control works on mobile viewport', async ({ homePage, pageObjects }) => {
    await homePage.setViewportSize(TestData.viewports.mobile);
    await homePage.waitForLoadState('networkidle');
    const homePageObj = pageObjects.homePage;
    await expect(homePageObj.soundControlButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    await homePageObj.openSoundControlPanel();
    const exercisePage = pageObjects.exercisePage;
    await expect(exercisePage.soundPanelTitle).toBeVisible();
  });

  test('Instructions toggle works correctly', async ({ homePage, pageObjects }) => {
    await test.step('Open sound panel', async () => {
      await homePage.waitForLoadState('networkidle');
      const homePageObj = pageObjects.homePage;
      await homePageObj.openSoundControlPanel();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.soundPanelTitle).toBeVisible();
    });

    await test.step('Toggle instructions', async () => {
      const homePageObj = pageObjects.homePage;
      await expect(homePageObj.instructionsToggle).toBeVisible();
      const initialState = await homePageObj.instructionsToggle.getAttribute('aria-checked');
      expect(initialState).not.toBeNull();
      await homePageObj.toggleInstructions();
      await expect(homePageObj.instructionsToggle).not.toHaveAttribute('aria-checked', initialState!);
    });
  });

  test('Exercise guide toggle works correctly', async ({ homePage, pageObjects }) => {
    await test.step('Open sound panel', async () => {
      await homePage.waitForLoadState('networkidle');
      const homePageObj = pageObjects.homePage;
      await homePageObj.openSoundControlPanel();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.soundPanelTitle).toBeVisible();
    });

    await test.step('Toggle exercise guide', async () => {
      const homePageObj = pageObjects.homePage;
      await expect(homePageObj.guideToggle).toBeVisible();
      const initialState = await homePageObj.guideToggle.getAttribute('aria-checked');
      expect(initialState).not.toBeNull();
      await homePageObj.toggleExerciseGuide();
      await expect(homePageObj.guideToggle).not.toHaveAttribute('aria-checked', initialState!);
    });
  });

  test('Mute all button works correctly', async ({ homePage, pageObjects }) => {
    await test.step('Open sound panel', async () => {
      await homePage.waitForLoadState('networkidle');
      const homePageObj = pageObjects.homePage;
      await homePageObj.openSoundControlPanel();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.soundPanelTitle).toBeVisible();
    });

    await test.step('Mute all sounds', async () => {
      const homePageObj = pageObjects.homePage;
      await expect(homePageObj.muteAllButton).toBeVisible();
      
      // Get initial states
      const bgInitial = await homePageObj.backgroundToggle.getAttribute('aria-checked');
      const instInitial = await homePageObj.instructionsToggle.getAttribute('aria-checked');
      const guideInitial = await homePageObj.guideToggle.getAttribute('aria-checked');
      
      // Click mute all if any are enabled
      if (bgInitial === 'true' || instInitial === 'true' || guideInitial === 'true') {
        await homePageObj.muteAllButton.click();
        
        // Verify all are muted
        await expect(homePageObj.backgroundToggle).toHaveAttribute('aria-checked', 'false');
        await expect(homePageObj.instructionsToggle).toHaveAttribute('aria-checked', 'false');
        await expect(homePageObj.guideToggle).toHaveAttribute('aria-checked', 'false');
      }
    });

    await test.step('Unmute all sounds', async () => {
      const homePageObj = pageObjects.homePage;
      await homePageObj.muteAllButton.click();
      
      // Verify all are unmuted
      await expect(homePageObj.backgroundToggle).toHaveAttribute('aria-checked', 'true');
      await expect(homePageObj.instructionsToggle).toHaveAttribute('aria-checked', 'true');
      await expect(homePageObj.guideToggle).toHaveAttribute('aria-checked', 'true');
    });
  });

  test('Sound controls work after switching language to Spanish', async ({ homePage, pageObjects }) => {
    await expectHomePageURL(homePage);
    const homePageObj = pageObjects.homePage;
    await homePage.waitForLoadState('networkidle');
    await homePageObj.switchLanguage('ES');
    await homePageObj.clickOneMinButton();
    const exercisePage = pageObjects.exercisePage;
    await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
    await expect(exercisePage.soundControlButton).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
    await exercisePage.openSoundControlPanel();
    await expect(exercisePage.soundPanelTitle).toBeVisible();
    await expect(exercisePage.backgroundToggle).toBeVisible();
    await expect(exercisePage.instructionsToggle).toBeVisible();
    await expect(exercisePage.guideToggle).toBeVisible();
  });

  test('All sound controls work together', async ({ homePage, pageObjects }) => {
    await test.step('Open sound panel', async () => {
      await homePage.waitForLoadState('networkidle');
      const homePageObj = pageObjects.homePage;
      await homePageObj.openSoundControlPanel();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.soundPanelTitle).toBeVisible();
    });

    await test.step('Toggle each control independently', async () => {
      const homePageObj = pageObjects.homePage;
      
      // Toggle background
      const bgInitial = await homePageObj.backgroundToggle.getAttribute('aria-checked');
      await homePageObj.toggleBackgroundSounds();
      await expect(homePageObj.backgroundToggle).not.toHaveAttribute('aria-checked', bgInitial!);
      
      // Toggle instructions
      const instInitial = await homePageObj.instructionsToggle.getAttribute('aria-checked');
      await homePageObj.toggleInstructions();
      await expect(homePageObj.instructionsToggle).not.toHaveAttribute('aria-checked', instInitial!);
      
      // Toggle guide
      const guideInitial = await homePageObj.guideToggle.getAttribute('aria-checked');
      await homePageObj.toggleExerciseGuide();
      await expect(homePageObj.guideToggle).not.toHaveAttribute('aria-checked', guideInitial!);
    });
  });
});

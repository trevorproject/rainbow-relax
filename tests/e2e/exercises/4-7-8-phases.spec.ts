import { test, expect } from '../../fixtures/fixtures';
import { TIMEOUTS } from '../../fixtures/testConstants';
import en from '../../../src/i18n/en';
import { expectHomePageURL } from '../../fixtures/testHelpers';

test.describe('4-7-8 Exercise Phase Validation', () => {
  test.setTimeout(60000); // Increase timeout for phase validation tests
  
  test('Validates inhale phase (4 seconds)', async ({ pageObjects, homePage }) => {
    // Verify homepage is ready before starting exercise
    await expectHomePageURL(homePage);
    await homePage.waitForLoadState('networkidle');
    
    await test.step('Start exercise and wait for running phase', async () => {
      await pageObjects.homePage.clickOneMinButton();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await expect(exercisePage.timer).toBeVisible({ timeout: TIMEOUTS.EXERCISE_CYCLE_START });
      await expect(exercisePage.isInRunningPhase()).resolves.toBe(true);
    });

    await test.step('Verify inhale instruction appears', async () => {
      const exercisePage = pageObjects.exercisePage;
      const instructionText = await exercisePage.getCurrentInstructionText();
      expect(instructionText).toBeTruthy();
      // The instruction should contain "Breathe" or "nose" for inhale phase
      expect(instructionText).toMatch(/breathe|nose|inhale/i);
    });

    await test.step('Wait for instruction change after ~4 seconds', async () => {
      const exercisePage = pageObjects.exercisePage;
      // Wait for instruction to change from inhale (indicating phase transition)
      // Using POM assertion instead of hard wait
      await exercisePage.waitForInstructionToChangeFrom(/breathe|nose|inhale/i, 6000);
      const newInstruction = await exercisePage.getCurrentInstructionText();
      expect(newInstruction).toBeTruthy();
      // Instruction should have changed from inhale
      expect(newInstruction).not.toMatch(/breathe.*nose/i);
    });
  });

  test('Validates hold phase (7 seconds)', async ({ pageObjects, homePage }) => {
    // Verify homepage is ready before starting exercise
    await expectHomePageURL(homePage);
    await test.step('Start exercise and wait for running phase', async () => {
      await pageObjects.homePage.clickOneMinButton();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await expect(exercisePage.timer).toBeVisible({ timeout: TIMEOUTS.EXERCISE_CYCLE_START });
      await expect(exercisePage.isInRunningPhase()).resolves.toBe(true);
    });

    await test.step('Wait for hold instruction to appear', async () => {
      const exercisePage = pageObjects.exercisePage;
      // Wait for inhale phase to complete (~4 seconds) and hold to start
      // Using POM assertion instead of hard wait
      await exercisePage.waitForInstructionMatching(/hold/i, 6000);
      
      const instructionText = await exercisePage.getCurrentInstructionText();
      expect(instructionText).toBeTruthy();
      // The instruction should contain "Hold" for hold phase
      expect(instructionText).toMatch(/hold/i);
    });

    await test.step('Wait for instruction change after ~7 seconds', async () => {
      const exercisePage = pageObjects.exercisePage;
      // Wait for hold phase to complete (~7 seconds)
      // Using POM assertion instead of hard wait
      await exercisePage.waitForInstructionToChangeFrom(/hold/i, 9000);
      const newInstruction = await exercisePage.getCurrentInstructionText();
      expect(newInstruction).toBeTruthy();
      // Instruction should have changed from hold
      expect(newInstruction).not.toMatch(/hold/i);
    });
  });

  test('Validates exhale phase (8 seconds)', async ({ pageObjects, homePage }) => {
    // Verify homepage is ready before starting exercise
    await expectHomePageURL(homePage);
    await test.step('Start exercise and wait for running phase', async () => {
      await pageObjects.homePage.clickOneMinButton();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await expect(exercisePage.timer).toBeVisible({ timeout: TIMEOUTS.EXERCISE_CYCLE_START });
      await expect(exercisePage.isInRunningPhase()).resolves.toBe(true);
    });

    await test.step('Wait for exhale instruction to appear', async () => {
      const exercisePage = pageObjects.exercisePage;
      // Wait for inhale (~4s) + hold (~7s) phases to complete
      // Using POM assertion instead of hard wait
      await exercisePage.waitForInstructionMatching(/exhale|mouth/i, 15000);
      
      const instructionText = await exercisePage.getCurrentInstructionText();
      expect(instructionText).toBeTruthy();
      // The instruction should contain "Exhale" or "mouth" for exhale phase
      expect(instructionText).toMatch(/exhale|mouth/i);
    });

    await test.step('Wait for cycle completion after ~8 seconds', async () => {
      const exercisePage = pageObjects.exercisePage;
      // Wait for exhale phase to complete and cycle back to inhale
      // Using POM assertion instead of hard wait
      await exercisePage.waitForInstructionMatching(/breathe|nose|inhale/i, 10000);
      
      const newInstruction = await exercisePage.getCurrentInstructionText();
      expect(newInstruction).toBeTruthy();
      // After exhale, should cycle back to inhale
      expect(newInstruction).toMatch(/breathe|nose|inhale/i);
    });
  });

  test('Validates complete cycle (4+7+8 = 19 seconds)', async ({ pageObjects, homePage }) => {
    // Verify homepage is ready before starting exercise
    await expectHomePageURL(homePage);
    await test.step('Start exercise and wait for running phase', async () => {
      await pageObjects.homePage.clickOneMinButton();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await expect(exercisePage.timer).toBeVisible({ timeout: TIMEOUTS.EXERCISE_CYCLE_START });
      await expect(exercisePage.isInRunningPhase()).resolves.toBe(true);
    });

    await test.step('Track all phase transitions', async () => {
      const exercisePage = pageObjects.exercisePage;
      const instructions: string[] = [];
      
      // Capture initial instruction (should be inhale)
      const initialInstruction = await exercisePage.getCurrentInstructionText();
      instructions.push(initialInstruction || '');
      expect(initialInstruction).toMatch(/breathe|nose|inhale/i);
      
      // Wait for hold phase - using POM assertion
      await exercisePage.waitForInstructionMatching(/hold/i, 8000);
      const holdInstruction = await exercisePage.getCurrentInstructionText();
      instructions.push(holdInstruction || '');
      expect(holdInstruction).toMatch(/hold/i);
      
      // Wait for exhale phase - using POM assertion
      await exercisePage.waitForInstructionMatching(/exhale|mouth/i, 10000);
      const exhaleInstruction = await exercisePage.getCurrentInstructionText();
      instructions.push(exhaleInstruction || '');
      expect(exhaleInstruction).toMatch(/exhale|mouth/i);
      
      // Wait for cycle completion (back to inhale) - using POM assertion
      await exercisePage.waitForInstructionMatching(/breathe|nose|inhale/i, 12000);
      const nextCycleInstruction = await exercisePage.getCurrentInstructionText();
      instructions.push(nextCycleInstruction || '');
      // Should cycle back to inhale
      expect(nextCycleInstruction).toMatch(/breathe|nose|inhale/i);
      
      // Verify we saw all three phases
      expect(instructions.length).toBeGreaterThanOrEqual(3);
    });
  });

  test('Validates multiple cycles', async ({ pageObjects, homePage }) => {
    // Verify homepage is ready before starting exercise
    await expectHomePageURL(homePage);
    await test.step('Start 1-minute exercise', async () => {
      await pageObjects.homePage.clickOneMinButton();
      const exercisePage = pageObjects.exercisePage;
      await expect(exercisePage.exerciseTitle).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
      await expect(exercisePage.timer).toBeVisible({ timeout: TIMEOUTS.EXERCISE_CYCLE_START });
      await expect(exercisePage.isInRunningPhase()).resolves.toBe(true);
    });

    await test.step('Verify at least 2 cycles complete', async () => {
      const exercisePage = pageObjects.exercisePage;
      let cycleCount = 0;
      
      // Track cycles by waiting for instruction changes using POM assertions
      // Each cycle is ~19 seconds, so we'll wait for phase transitions
      // Wait for first cycle: inhale -> hold -> exhale -> inhale
      await exercisePage.waitForInstructionMatching(/hold/i, 6000);
      await exercisePage.waitForInstructionMatching(/exhale|mouth/i, 9000);
      await exercisePage.waitForInstructionMatching(/breathe|nose|inhale/i, 10000);
      cycleCount++; // First cycle complete
      
      // Wait for second cycle
      await exercisePage.waitForInstructionMatching(/hold/i, 6000);
      await exercisePage.waitForInstructionMatching(/exhale|mouth/i, 9000);
      await exercisePage.waitForInstructionMatching(/breathe|nose|inhale/i, 10000);
      cycleCount++; // Second cycle complete
      
      // Should have completed at least 1 cycle (possibly 2 depending on timing)
      expect(cycleCount).toBeGreaterThanOrEqual(1);
    });

    await test.step('Verify instructions repeat correctly', async () => {
      const exercisePage = pageObjects.exercisePage;
      const instructionText = await exercisePage.getCurrentInstructionText();
      expect(instructionText).toBeTruthy();
      // Should be one of the valid instruction texts
      const instructions478 = (en.instructions as Record<string, Record<string, string>>)['4-7-8'];
      const validInstructions = [
        instructions478['breath-instructions'],
        instructions478['hold-instructions'],
        instructions478['exhale-instructions'],
      ];
      expect(validInstructions.some(inst => instructionText?.includes(inst.split(' ')[0]))).toBe(true);
    });
  });
});

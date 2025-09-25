/**
 * Page Object Models Index
 * 
 * This file exports all page object models for easy importing in test files.
 * 
 * Usage in test files:
 * import { HomePage, BreathingExercisePage } from '../page-objects';
 */

export { BreathingExercisePage } from './BreathingExercisePage';
export { HomePage } from './HomePage';
export { ThankYouPage } from './ThankYouPage';

// Re-export test data for convenience
export { default as TestData } from '../fixtures/testData';

/**
 * Centralized timeout constants for test reliability
 * Based on actual operation types, not arbitrary values
 */
export const TIMEOUTS = {
  // Navigation and page loads
  NAVIGATION: 10000,
  PAGE_LOAD: 15000,
  
  // Animations and transitions
  ANIMATION_SHORT: 2000,
  ANIMATION_MEDIUM: 5000,
  ANIMATION_LONG: 10000,
  
  // Exercise-specific
  EXERCISE_INTRO_PHASE: 15000,
  EXERCISE_CYCLE_START: 30000,
  EXERCISE_PHASE_TRANSITION: 5000,
  
  // User interactions
  CLICK_ACTION: 3000,
  MODAL_OPEN: 3000,
  MODAL_CLOSE: 3000,
  
  // Network operations
  ASSET_LOAD: 10000,
  API_CALL: 5000,
} as const;

/**
 * DO NOT use arbitrary timeouts in tests
 * Use these constants or Playwright's default expect timeout
 */

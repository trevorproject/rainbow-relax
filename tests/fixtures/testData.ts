/**
 * Test fixtures and reusable test data
 * This file contains common test data that can be reused across multiple test files
 */

// Base URL for the application - can be overridden via environment variable
export const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export const TestData = {
  // Viewport sizes for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  },

  // Expected page titles
  titles: {
    homepage: /Breathing Exercise/,
    exercise: /4-7-8 Breathing/,
  },

  // URLs for navigation testing
  urls: {
    homepage: '/',
    exercise: '/exercise',
    about: '/about',
    thankyoupage: '/thank-you',
  },

  // Language-specific test data
  languages: {
    english: {
      code: 'en',
      flag: '🇺🇸',
      welcomeText: 'Welcome',
      endMessage: 'message',
      
    },
    spanish: {
      code: 'es',
      flag: '🇪🇸',
      welcomeText: 'Bienvenido',
      endMessage: 'mensaje'
    },
  },

  // Common test selectors (data-testid values)
  selectors: {
    // Navigation
    languageToggle: '[data-testid="language-toggle"]',
    languageToggleButton: '[data-testid="language-toggle-button"]',
    languageToggleEn: '[data-testid="language-toggle-en"]',
    languageToggleEs: '[data-testid="language-toggle-es"]',
    quickEscape: '[data-testid="quick-escape"]',
    quickEscapeModal: '[data-testid="quick-escape-modal"]',
    quickEscapeContent: '[data-testid="quick-escape-content"]',
    quickEscapeTitle: '[data-testid="quick-escape-title"]',
    quickEscapeCloseButton: '[data-testid="quick-escape-close-button"]',
    quickEscapeButton: '[data-testid="quick-escape-button"]',
    
    // Homepage
    startButton: '[data-testid="start-exercise-button"]',
    welcomeText: '[data-testid="welcome-text"]',
    donateUrl: '[data-testid="donate-url"]',
    preset1MinButton: '[data-testid="preset-1min-button"]',
    preset3MinButton: '[data-testid="preset-3min-button"]',
    preset5MinButton: '[data-testid="preset-5min-button"]',
    presetCustomButton: '[data-testid="preset-custom-button"]',
    customMinutesInput: '[data-testid="custom-minutes-input"]',
    customStartButton: '[data-testid="custom-start-button"]',
    
    // Breathing Exercise
    breathingCircle: '[data-testid="breathing-circle"]',
    pauseButton: '[data-testid="pause-button"]',
    playButton: '[data-testid="play-button"]',
    resetButton: '[data-testid="reset-button"]',
    timer: '[data-testid="timer"]',
    soundControlButton: '[data-testid="sound-control-button"]',
    soundControlContainer: '[data-testid="sound-control-container"]',
    soundPanel: '[data-testid="sound-control-panel"]',
    soundPanelTitle: '[data-testid="sound-panel-title"]',
    backgroundToggle: '[data-testid="background-sounds-toggle"]',
    instructionsToggle: '[data-testid="instructions-toggle"]',
    guideToggle: '[data-testid="exercise-guide-toggle"]',
    muteAllButton: '[data-testid="mute-all-button"]',
    backButton: '[data-testid="back-button"]',
    instructionText: '[data-testid="instruction-text"]',
    exerciseTitle: '[data-testid="exercise-title"]',
    exerciseSubtitle: '[data-testid="exercise-subtitle"]',
    exerciseIntroText: '[data-testid="exercise-intro-text"]',
    
    // Welcome Page
    infoButton: '[data-testid="info-button"]',
    infoText: '[data-testid="info-text"]',
    
    // Mobile
    mobileMenu: '[data-testid="mobile-menu"]',
    hamburgerButton: '[data-testid="hamburger-button"]',

    // Thank You Page
    endMessage: '[data-testid="end-message"]',
    getHelpUrl: '[data-testid="get-help-url"]',
    tryAgain: '[data-testid="try-again-url"]',
    
    // Survey
    surveyYesButton: '[data-testid="survey-yes-button"]',
    surveySkipButton: '[data-testid="survey-skip-button"]',
    surveyOptionSame: '[data-testid="survey-option-same"]',
    surveyOptionABitBetter: '[data-testid="survey-option-a_bit_better"]',
    surveyOptionMoreRelaxed: '[data-testid="survey-option-more_relaxed"]',
    surveyOptionMuchMoreCalm: '[data-testid="survey-option-much_more_calm"]',
    
    // Widget Configuration
    navbarHeader: '[data-testid="navbar-header"]',
    logo: '[data-testid="logo"]',
    logoImage: '[data-testid="logo-image"]',
    donateButton: '[data-testid="donate-button"]',
    helpButton: '[data-testid="help-button"]',
    
    // Consent Page
    consentPage: '[data-testid="consent-page"]',
    consentPageLoading: '[data-testid="consent-page-loading"]',
    consentPromptOverlay: '[data-testid="consent-prompt-overlay"]',
    consentPromptDialog: '[data-testid="consent-prompt-dialog"]',
    consentPromptTitle: '[data-testid="consent-prompt-title"]',
    consentPromptDescription: '[data-testid="consent-prompt-description"]',
    consentButtonLoadFull: '[data-testid="consent-button-load-full"]',
    consentButtonStayLightweight: '[data-testid="consent-button-stay-lightweight"]',
  },

  // Audio-related test data
  audio: {
    backgroundMusic: 'Background.mp3',
    instructionsEnglish: {
      intro: 'intro-en.mp3',
      cycle: 'cycle-en.mp3',
    },
    instructionsSpanish: {
      intro: 'intro-es.mp3',
      cycle: 'cycle-es.mp3',
    },
  },

  // Animation timing (in milliseconds)
  animations: {
    breathingCycleDuration: 20000, // 20 seconds for complete 4-7-8 cycle
    fadeInDuration: 500,
    transitionDuration: 300,
  },

  // Widget configuration test data
  widgetConfig: {
    params: {
      logoUrl: 'logoUrl',
      audioUrl: 'audioUrl',
      backgroundUrl: 'backgroundUrl',
      instructionsUrl: 'instructionsUrl',
      guidedVoiceUrl: 'guidedVoiceUrl',
      donationUrl: 'donationUrl',
      helpUrl: 'helpUrl',
      homeUrl: 'homeUrl',
    },
    testAssets: {
      customLogo: 'https://via.placeholder.com/150x150/007bff/ffffff?text=Test+Logo',
      customAudio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    },
    customUrls: {
      donation: 'https://example.com/donate',
      help: 'https://example.com/help',
      home: 'https://example.com',
    },
    hiddenValue: 'no',
  },
};

export default TestData;

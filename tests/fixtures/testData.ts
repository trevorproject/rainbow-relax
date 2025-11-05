/**
 * Test fixtures and reusable test data
 * This file contains common test data that can be reused across multiple test files
 */

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
    quickEscape: '[data-testid="quick-escape"]',
    
    // Homepage
    startButton: '[data-testid="start-exercise-button"]',
    welcomeText: '[data-testid="welcome-text"]',
    donateUrl: '[data-testid="donate-url"]',
    
    // Breathing Exercise
    breathingCircle: '[data-testid="breathing-circle"]',
    pauseButton: '[data-testid="pause-button"]',
    playButton: '[data-testid="play-button"]',
    resetButton: '[data-testid="reset-button"]',
    timer: '[data-testid="timer"]',
    soundToggle: '[data-testid="sound-toggle"]',
    backButton: '[data-testid="back-button"]',
    instructionText: '[data-testid="instruction-text"]',
    
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

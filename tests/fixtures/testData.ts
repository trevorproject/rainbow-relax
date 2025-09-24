export const TestData = {
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  },

  titles: {
    homepage: /Breathing Exercise/,
    exercise: /4-7-8 Breathing/,
  },

  urls: {
    homepage: '/',
    exercise: '/exercise',
    about: '/about',
    thankyoupage: '/thank-you',
  },

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

  selectors: {
    languageToggle: '[data-testid="language-toggle"]',
    quickEscape: '[data-testid="quick-escape"]',
    startButton: '[data-testid="start-exercise-button"]',
    welcomeText: '[data-testid="welcome-text"]',
    donateUrl: '[data-testid="donate-url"]',
    breathingCircle: '[data-testid="breathing-circle"]',
    pauseButton: '[data-testid="pause-button"]',
    resetButton: '[data-testid="reset-button"]',
    mobileMenu: '[data-testid="mobile-menu"]',
    hamburgerButton: '[data-testid="hamburger-button"]',
    endMessage: '[data-testid="end-message"]',
    getHelpUrl: '[data-testid="get-help-url"]',
    tryAgain: '[data-testid="try-again-url"]',
  },

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

  animations: {
    breathingCycleDuration: 20000,
    fadeInDuration: 500,
    transitionDuration: 300,
  },
};

export default TestData;

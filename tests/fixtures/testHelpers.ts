import { Page, expect } from '@playwright/test';

export const WidgetSelectors = {
  languageToggle: '[data-testid="language-toggle"]',
  startButton1Min: '[data-testid="start-exercise-button-1min"]',
  startButton3Min: '[data-testid="start-exercise-button-3min"]',
  startButton5Min: '[data-testid="start-exercise-button-5min"]',
  customTimeButton: '[data-testid="custom-time-button"]',
  customTimeInput: '[data-testid="custom-time-input"]',
  customStartButton: '[data-testid="custom-start-button"]',
  startButton0Min: '[data-testid="start-exercise-button-0min"]',
  breathingInstructions: '.rr-breathing-instructions',
  breathingTitle: '.rr-breathing-instructions h1',
  breathingText: '.rr-breathing-instructions p',
  breathingTimer: '[data-testid="breathing-timer"]',
  breathingInstruction: '[data-testid="breathing-instruction"]',
  backButton: 'svg[class*="lucide-arrow-left"]',
  pausePlayButton: '[data-testid="pause-play-button"]',
  soundButton: 'div.rr-mt-8.rr-cursor-pointer',
  volumeIcon: 'svg[class*="lucide-volume"]',
  welcomePage: '[data-testid="welcome-page"]',
  thankYouPage: '[data-testid="thank-you-page"]',
  widgetContainer: '#rainbow-relax-container',
  navbar: '[data-testid="navbar"]',
  donateButton: '[data-testid="donate-button"]',
  logo: '[data-testid="logo"]',
  mainAnimation: '[data-testid="main-animation"]',
  breathingCircles: '[data-testid^="breathing-circle-"]',
};

export async function navigateToWidget(page: Page) {
  await page.goto('/widget-test.html');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('#rainbow-relax-container', { timeout: 10000 });
  
  // Wait for widget to be fully loaded
  await page.waitForFunction(() => {
    const container = document.getElementById('rainbow-relax-container');
    return container && container.children.length > 0;
  }, { timeout: 10000 });
}

export async function startBreathingExercise(page: Page, duration: string = '1 min') {
  const startButton = page.locator(`[data-testid="start-exercise-button-${duration.replace(' ', '')}"]`);
  await expect(startButton).toBeVisible();
  await startButton.click();
  await expect(page.locator('.rr-breathing-instructions')).toBeVisible();
}

export async function navigateToThankYouPage(page: Page) {
  await startBreathingExercise(page);
  await page.waitForFunction(() => {
    const timer = document.querySelector('h2');
    return timer && timer.textContent === '0:00';
  }, { timeout: 60000 });
  await page.waitForSelector(WidgetSelectors.thankYouPage, { timeout: 5000 });
}

export async function closeQuickEscapeModal(page: Page) {
  return;
}

export async function waitForBreathingExerciseToStart(page: Page) {
  await page.waitForFunction(() => {
    const timer = document.querySelector('h2');
    return timer && /\d+:\d+/.test(timer.textContent || '');
  }, { timeout: 10000 });
}

export async function waitForBreathingInstructions(page: Page) {
  await page.waitForFunction(() => {
    const paragraphs = document.querySelectorAll('p');
    return Array.from(paragraphs).some(p => 
      /(inhale|exhale|hold)/i.test(p.textContent || '')
    );
  }, { timeout: 15000 });
}

export async function safeClick(page: Page, selector: string, timeout: number = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.locator(selector).click();
    return true;
  } catch (error) {
    console.log(`Element ${selector} not found or not clickable`);
    return false;
  }
}

export async function safeGetText(page: Page, selector: string): Promise<string | null> {
  try {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      return await element.textContent();
    }
    return null;
  } catch (error) {
    return null;
  }
}

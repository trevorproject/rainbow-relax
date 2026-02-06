import { Page } from '@playwright/test';

export async function setupCookieConsent(page: Page): Promise<void> {
  const context = page.context();
  const url = page.url();
  
  if (!url) return;
  
  await page.addInitScript(() => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 150);
    localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
      value: 'true',
      expires: expirationDate.getTime(),
    }));
    
    document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
  });
  
  try {
    const urlObj = new URL(url);
    await context.addCookies([{
      name: 'cookie1',
      value: 'true',
      path: '/',
      domain: urlObj.hostname === 'localhost' ? 'localhost' : urlObj.hostname,
      sameSite: 'Lax' as const,
      expires: Math.floor(Date.now() / 1000) + 12960000,
    }]);
  } catch {
    await page.evaluate(() => {
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
  }
  
  await page.evaluate(() => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 150);
    localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
      value: 'true',
      expires: expirationDate.getTime(),
    }));
    document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
  });
  
  const cookies = await context.cookies();
  const hasCookie = cookies.some(c => c.name === 'cookie1' && c.value === 'true');
  if (!hasCookie) {
    await page.evaluate(() => {
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
  }
}

export async function setupSurveyState(page: Page, options?: { clearCompleted?: boolean }): Promise<void> {
  const clearCompleted = options?.clearCompleted ?? true;
  
  if (!clearCompleted) return;
  
  await page.addInitScript(() => {
    localStorage.removeItem('survey_completed');
    localStorage.removeItem('survey_completion_date');
  });
  
  if (page.url()) {
    try {
      await page.evaluate(() => {
        localStorage.removeItem('survey_completed');
        localStorage.removeItem('survey_completion_date');
      });
    } catch {
      // Ignore if page not navigated yet
    }
  }
}

export async function setupAffirmationMessageState(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.removeItem('shownMessageIndices');
  });
  
  if (page.url()) {
    try {
      await page.evaluate(() => {
        localStorage.removeItem('shownMessageIndices');
      });
    } catch {
      // Ignore if page not navigated yet
    }
  }
}

export async function setupThankYouPageState(page: Page): Promise<void> {
  await setupSurveyState(page, { clearCompleted: true });
  await setupAffirmationMessageState(page);
  await setupCookieConsent(page);
}

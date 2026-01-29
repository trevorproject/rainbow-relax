import { test as base, expect, Page } from '@playwright/test';
import {
  closeQuickEscapeModal,
  acceptCookieIfExist,
  waitForExerciseIntroPhase,
  waitForExerciseRunningPhase,
} from './testHelpers';
import {
  HomePage,
  BreathingExercisePage,
  ThankYouPage,
  WidgetConfigPage,
  SurveyPage,
  ConsentPage,
} from '../page-objects';

export interface PageObjects {
  readonly homePage: HomePage;
  readonly exercisePage: BreathingExercisePage;
  readonly thankYouPage: ThankYouPage;
  readonly widgetConfigPage: WidgetConfigPage;
  readonly surveyPage: SurveyPage;
  readonly consentPage: ConsentPage;
}

export interface ExerciseFixture {
  readonly exercisePage: BreathingExercisePage;
  readonly homePage: HomePage;
  navigateToExercise(duration: '1min' | '3min' | '5min' | number): Promise<void>;
  waitForIntro(): Promise<void>;
  waitForRunning(): Promise<void>;
}

export const homePageFixture = base.extend<{ homePage: Page }>({
  homePage: [async ({ page }, use) => {
    await page.addInitScript(() => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 150);
      localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
        value: 'true',
        expires: expirationDate.getTime(),
      }));
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
    
    await page.goto('/?showquickescape=false', { waitUntil: 'domcontentloaded' });
    
    await page.evaluate(() => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 150);
      localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
        value: 'true',
        expires: expirationDate.getTime(),
      }));
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
    
    await closeQuickEscapeModal(page);
    await acceptCookieIfExist(page);
    await page.waitForLoadState('networkidle');
    await use(page);
  }, { scope: 'test' }],
});

export const thankYouPageFixture = base.extend<{ thankYouPage: Page }>({
  thankYouPage: [async ({ page }, use) => {
    const context = page.context();
    
    await page.addInitScript(() => {
      localStorage.removeItem('survey_completed');
      localStorage.removeItem('survey_completion_date');
      localStorage.removeItem('shownMessageIndices');
      localStorage.setItem('rainbow-relax-bandwidth-consent', 'true');
      
      // Set GA consent in localStorage and cookie
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 150);
      localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
        value: 'true',
        expires: expirationDate.getTime(),
      }));
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
    
    await context.addCookies([{
      name: 'cookie1',
      value: 'true',
      path: '/',
      domain: 'localhost',
      sameSite: 'Lax' as const,
      expires: Math.floor(Date.now() / 1000) + 12960000,
    }]);
    
    await page.goto('/thank-you?showquickescape=false', { waitUntil: 'domcontentloaded' });
    
    await expect(page).toHaveURL(/\/thank-you/);
    
    await page.evaluate(() => {
      localStorage.setItem('rainbow-relax-bandwidth-consent', 'true');
      
      // Set GA consent in localStorage and cookie
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 150);
      localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
        value: 'true',
        expires: expirationDate.getTime(),
      }));
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
    
    await closeQuickEscapeModal(page);
    await acceptCookieIfExist(page);
    await page.waitForLoadState('networkidle');
    
    await page.waitForFunction(
      () => {
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('cookie1='));
        return cookieValue && cookieValue.includes('cookie1=true');
      },
      { timeout: 5000 }
    );
    
    await use(page);
  }, { scope: 'test' }],
});

export const pageObjects = base.extend<{ pageObjects: PageObjects }>({
  pageObjects: [async ({ page }, use) => {
    const pageObjects = {
      get homePage() {
        return new HomePage(page);
      },
      get exercisePage() {
        return new BreathingExercisePage(page);
      },
      get thankYouPage() {
        return new ThankYouPage(page);
      },
      get widgetConfigPage() {
        return new WidgetConfigPage(page);
      },
      get surveyPage() {
        return new SurveyPage(page);
      },
      get consentPage() {
        return new ConsentPage(page);
      },
    };
    
    await use(pageObjects);
  }, { scope: 'test' }],
});

export const exerciseFixture = base.extend<{ exerciseFixture: ExerciseFixture }>({
  exerciseFixture: [async ({ page }, use) => {
    const pageObjects = {
      get homePage() {
        return new HomePage(page);
      },
      get exercisePage() {
        return new BreathingExercisePage(page);
      },
    };

    const fixture: ExerciseFixture = {
      get exercisePage() {
        return pageObjects.exercisePage;
      },
      get homePage() {
        return pageObjects.homePage;
      },
      
      async navigateToExercise(duration: '1min' | '3min' | '5min' | number) {
        const homePage = pageObjects.homePage;
        if (duration === '1min') {
          await homePage.clickOneMinButton();
        } else if (duration === '3min') {
          await homePage.clickThreeMinButton();
        } else if (duration === '5min') {
          await homePage.clickFiveMinButton();
        } else {
          await homePage.startCustomExercise(duration);
        }
        await waitForExerciseIntroPhase(page);
      },
      
      async waitForIntro() {
        await waitForExerciseIntroPhase(page);
      },
      
      async waitForRunning() {
        await waitForExerciseRunningPhase(page);
      },
    };
    
    await use(fixture);
  }, { scope: 'test' }],
});

export const test = base.extend<{
  homePage: Page;
  thankYouPage: Page;
  pageObjects: PageObjects;
  exerciseFixture: ExerciseFixture;
}>({
  homePage: [async ({ page }, use) => {
    await page.addInitScript(() => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 150);
      localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
        value: 'true',
        expires: expirationDate.getTime(),
      }));
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
    
    await page.goto('/?showquickescape=false', { waitUntil: 'domcontentloaded' });
    
    await page.evaluate(() => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 150);
      localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
        value: 'true',
        expires: expirationDate.getTime(),
      }));
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
    
    await closeQuickEscapeModal(page);
    await acceptCookieIfExist(page);
    await page.waitForLoadState('networkidle');
    await use(page);
  }, { scope: 'test' }],
  
  thankYouPage: [async ({ page }, use) => {
    const context = page.context();
    
    await page.addInitScript(() => {
      localStorage.removeItem('survey_completed');
      localStorage.removeItem('survey_completion_date');
      localStorage.removeItem('shownMessageIndices');
      localStorage.setItem('rainbow-relax-bandwidth-consent', 'true');
      
      // Set GA consent in localStorage and cookie
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 150);
      localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
        value: 'true',
        expires: expirationDate.getTime(),
      }));
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
    
    await context.addCookies([{
      name: 'cookie1',
      value: 'true',
      path: '/',
      domain: 'localhost',
      sameSite: 'Lax' as const,
      expires: Math.floor(Date.now() / 1000) + 12960000,
    }]);
    
    await page.goto('/thank-you?showquickescape=false', { waitUntil: 'domcontentloaded' });
    
    await expect(page).toHaveURL(/\/thank-you/);
    
    await page.evaluate(() => {
      localStorage.setItem('rainbow-relax-bandwidth-consent', 'true');
      
      // Set GA consent in localStorage and cookie
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 150);
      localStorage.setItem('rainbow-relax-ga-consent', JSON.stringify({
        value: 'true',
        expires: expirationDate.getTime(),
      }));
      document.cookie = 'cookie1=true; path=/; SameSite=Lax; max-age=12960000';
    });
    
    await closeQuickEscapeModal(page);
    await acceptCookieIfExist(page);
    await page.waitForLoadState('networkidle');
    
    await page.waitForFunction(
      () => {
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('cookie1='));
        return cookieValue && cookieValue.includes('cookie1=true');
      },
      { timeout: 5000 }
    );
    
    await use(page);
  }, { scope: 'test' }],
  
  pageObjects: [async ({ page }, use) => {
    const pageObjects: PageObjects = {
      get homePage() {
        return new HomePage(page);
      },
      get exercisePage() {
        return new BreathingExercisePage(page);
      },
      get thankYouPage() {
        return new ThankYouPage(page);
      },
      get widgetConfigPage() {
        return new WidgetConfigPage(page);
      },
      get surveyPage() {
        return new SurveyPage(page);
      },
      get consentPage() {
        return new ConsentPage(page);
      },
    };
    await use(pageObjects);
  }, { scope: 'test' }],
  
  exerciseFixture: [async ({ page, pageObjects }, use) => {
    const fixture: ExerciseFixture = {
      get exercisePage() {
        return pageObjects.exercisePage;
      },
      get homePage() {
        return pageObjects.homePage;
      },
      
      async navigateToExercise(duration: '1min' | '3min' | '5min' | number) {
        const homePage = pageObjects.homePage;
        if (duration === '1min') {
          await homePage.clickOneMinButton();
        } else if (duration === '3min') {
          await homePage.clickThreeMinButton();
        } else if (duration === '5min') {
          await homePage.clickFiveMinButton();
        } else {
          await homePage.startCustomExercise(duration);
        }
        await waitForExerciseIntroPhase(page);
      },
      
      async waitForIntro() {
        await waitForExerciseIntroPhase(page);
      },
      
      async waitForRunning() {
        await waitForExerciseRunningPhase(page);
      },
    };
    
    await use(fixture);
  }, { scope: 'test' }],
});

export { expect };

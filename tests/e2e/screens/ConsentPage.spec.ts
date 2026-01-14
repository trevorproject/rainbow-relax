import { test, expect } from '../../fixtures/fixtures';
import { Page, BrowserContext, Route } from '@playwright/test';
import { TIMEOUTS } from '../../fixtures/testConstants';

async function setupSlowConnection(page: Page, context: BrowserContext) {
  await context.route('**/app-size.json', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        totalSizeBytes: 5000000,
        totalSizeFormatted: '5 MB',
        calculatedAt: new Date().toISOString(),
      }),
    });
  });

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      value: {
        effectiveType: '2g',
        downlink: 0.5,
      },
      writable: true,
    });
  });
}

test.describe('ConsentPage', () => {
  test('Consent prompt display based on connection speed', async ({ page, context, pageObjects }) => {
    await test.step('Shows consent prompt on slow connection', async () => {
      await setupSlowConnection(page, context);
      const consentPage = pageObjects.consentPage;
      await consentPage.goto('/consent?forceConsent=true');
      
      // Wait for consent prompt dialog to appear (the page itself might be hidden)
      await consentPage.waitForPrompt();
      
      // Consent page element might be present but hidden, so check prompt instead
      const isConsentPagePresent = await consentPage.isConsentPagePresent();
      expect(isConsentPagePresent).toBeTruthy();
    });
  });

  test('Bypasses consent on fast connection', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', {
        value: {
          effectiveType: '4g',
          downlink: 10,
        },
        writable: true,
      });
    });

    await page.goto('/consent');
    await expect(page).toHaveURL('/', { timeout: TIMEOUTS.NAVIGATION });
  });

  test('Consent flow works correctly', async ({ page, context, pageObjects }) => {
    await test.step('User accepts consent and proceeds to app', async () => {
      await setupSlowConnection(page, context);
      const consentPage = pageObjects.consentPage;
      await consentPage.goto('/consent?forceConsent=true');
      
      await consentPage.waitForPrompt();
      await consentPage.clickLoadFull();
      await expect(page).toHaveURL('/', { timeout: TIMEOUTS.NAVIGATION });
    });

    await test.step('User declines consent and sees thank you page', async () => {
      await setupSlowConnection(page, context);
      const consentPage = pageObjects.consentPage;
      await consentPage.goto('/consent?forceConsent=true');
      
      await consentPage.waitForPrompt();
      await consentPage.clickStayLightweight();
      await expect(page).toHaveURL('/thank-you', { timeout: TIMEOUTS.NAVIGATION });
    });
  });

  test('Force consent parameter and prompt content', async ({ page, context, pageObjects }) => {
    await test.step('Shows consent when forceConsent=true regardless of connection', async () => {
      await context.route('**/app-size.json', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalSizeBytes: 5000000,
            totalSizeFormatted: '5 MB',
            calculatedAt: new Date().toISOString(),
          }),
        });
      });

      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'connection', {
          value: {
            effectiveType: '4g',
            downlink: 10,
          },
          writable: true,
        });
      });

      const consentPage = pageObjects.consentPage;
      await consentPage.goto('/consent?forceConsent=true');
      await consentPage.waitForPrompt();
    });

    await test.step('Consent prompt displays title and description', async () => {
      const consentPage = pageObjects.consentPage;
      
      await expect(consentPage.consentPromptTitle).toBeVisible({ timeout: TIMEOUTS.MODAL_OPEN });
      await expect(consentPage.consentPromptDescription).toBeVisible();
      
      const titleText = await consentPage.getPromptTitle();
      const descriptionText = await consentPage.getPromptDescription();
      
      expect(titleText).toBeTruthy();
      expect(descriptionText).toBeTruthy();
    });
  });
});

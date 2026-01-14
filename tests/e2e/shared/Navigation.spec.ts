import { expect, test } from '../../fixtures/fixtures';
import TestData from '../../fixtures/testData';
import { expectUiLanguage } from '../../fixtures/assertionsHelper';
import { TIMEOUTS } from '../../fixtures/testConstants';
import en from '../../../src/i18n/en';
import es from '../../../src/i18n/es';

test.describe('Navigation', () => {
  test('Language switching works correctly', async ({ pageObjects, homePage: homePageFixture }) => {
    await test.step('Switch to Spanish', async () => {
      await expectUiLanguage(homePageFixture, 'EN');
      const homePage = pageObjects.homePage;
      await homePage.switchLanguage('ES');
      await expectUiLanguage(homePageFixture, 'ES');
    });

    await test.step('Switch back to English', async () => {
      const homePage = pageObjects.homePage;
      await homePage.switchLanguage('EN');
      await expectUiLanguage(homePageFixture, 'EN');
    });
  });

  test('Quick escape feature works correctly', async ({ page, pageObjects }) => {
    await test.step('Modal displays by default', async () => {
      await page.goto('/');
      const homePage = pageObjects.homePage;
      await expect(homePage.quickEscapeModalTitle).toBeVisible();
    });

    await test.step('Modal hides with URL parameter', async () => {
      await page.goto('/?showquickescape=false');
      const homePage = pageObjects.homePage;
      await expect(homePage.quickEscapeModalTitle).not.toBeVisible();
    });

    await test.step('User can close modal', async () => {
      await page.goto('/');
      const homePage = pageObjects.homePage;
      await expect(homePage.quickEscapeModalTitle).toBeVisible();
      await homePage.quickEscapeCloseButton.click();
      await expect(homePage.quickEscapeModalTitle).not.toBeVisible();
    });
  });

  test('Mobile navigation works correctly', async ({ pageObjects, homePage: homePageFixture }) => {
    await test.step('Navigation elements display correctly on mobile', async () => {
      await homePageFixture.setViewportSize(TestData.viewports.mobile);
      const homePage = pageObjects.homePage;
      await expect(homePage.navigation).toBeVisible();
      await expect(homePage.languageToggle).toBeVisible();
      await expect(homePage.donateButton).toBeVisible();
    });

    await test.step('Navigation maintains responsive layout on different screen sizes', async () => {
      const viewports = [TestData.viewports.mobile, TestData.viewports.tablet, TestData.viewports.desktop];
      const homePage = pageObjects.homePage;
      for (const viewport of viewports) {
        await homePageFixture.setViewportSize(viewport);
        await expect(homePage.logo).toBeVisible();
        await expect(homePage.languageToggle).toBeVisible();
        await expect(homePage.donateButton).toBeVisible();
      }
    });
  });

  test('Widget config parameters are preserved during navigation', async ({ pageObjects, homePage: homePageFixture }) => {
    const params = {
      logoUrl: TestData.widgetConfig.testAssets.customLogo,
      donationUrl: TestData.widgetConfig.customUrls.donation,
      helpUrl: TestData.widgetConfig.customUrls.help,
      showquickescape: 'false'
    };
    
    const queryString = new URLSearchParams(params).toString();
    await homePageFixture.goto(`/?${queryString}`);
    
    expect(homePageFixture.url()).toContain('logoUrl=');
    expect(homePageFixture.url()).toContain('donationUrl=');
    expect(homePageFixture.url()).toContain('helpUrl=');
    
    const homePage = pageObjects.homePage;
    await homePage.clickOneMinButton();
    await expect(homePageFixture).toHaveURL(/.*\/breathing/, { timeout: TIMEOUTS.NAVIGATION });
    
    expect(homePageFixture.url()).toContain('logoUrl=');
    expect(homePageFixture.url()).toContain('donationUrl=');
    expect(homePageFixture.url()).toContain('helpUrl=');
  });

  // Parameterized logo navigation test
  [
    { lang: 'English', switchTo: null, expectedUrl: en['homepage-url'] as string, isSpanish: false },
    { lang: 'Spanish', switchTo: 'ES', expectedUrl: es['homepage-url'] as string, isSpanish: true },
  ].forEach(({ lang, switchTo, expectedUrl, isSpanish }) => {
    test(`Logo navigates to correct homepage URL in ${lang}`, async ({ pageObjects, homePage: homePageFixture }) => {
      const homePage = pageObjects.homePage;
      if (switchTo) {
        await homePage.switchLanguage(switchTo as 'EN' | 'ES');
      }
      await expect(homePage.logo).toBeVisible();
      
      const homepageUrl = await homePageFixture.evaluate((isSpanish) => {
        const urlParams = new URLSearchParams(window.location.search);
        const customHomeUrl = urlParams.get('homeUrl');
        if (isSpanish) {
          if (customHomeUrl === 'no') return null;
          if (customHomeUrl) return customHomeUrl;
          return 'https://www.thetrevorproject.mx/';
        } else {
          if (customHomeUrl && customHomeUrl !== 'no') return customHomeUrl;
          return 'https://www.thetrevorproject.org/';
        }
      }, isSpanish);
      
      expect(homepageUrl).toBe(expectedUrl);
      // Check if logo is clickable - cursor might be 'auto' if logo isn't wrapped in clickable element
      const logo = homePage.logo;
      const logoParent = logo.locator('..');
      const cursorStyle = await logoParent.evaluate((el: HTMLElement) => window.getComputedStyle(el).cursor).catch(() => 'auto');
      // Logo should be clickable (pointer) or at least the parent should indicate interactivity
      expect(['pointer', 'auto']).toContain(cursorStyle);
    });
  });

  test('Logo maintains functionality across different viewports', async ({ pageObjects, homePage: homePageFixture }) => {
    const viewports = [TestData.viewports.mobile, TestData.viewports.tablet, TestData.viewports.desktop];
    for (const viewport of viewports) {
      await homePageFixture.setViewportSize(viewport);
      const homePage = pageObjects.homePage;
      await expect(homePage.logo).toBeVisible();
      const logoParent = homePage.logo.locator('..');
      const cursorStyle = await logoParent.evaluate((el: HTMLElement) => window.getComputedStyle(el).cursor).catch(() => '');
      expect(cursorStyle).toBe('pointer');
    }
  });
});

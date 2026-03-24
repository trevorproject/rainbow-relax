import { expect, test } from '../../fixtures/fixtures';
import TestData from '../../fixtures/testData';
import { TIMEOUTS } from '../../fixtures/testConstants';

test.describe('Navigation', () => {
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

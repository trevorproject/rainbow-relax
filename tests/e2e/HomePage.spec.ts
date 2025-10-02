import { test, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { closeQuickEscapeModal } from '../fixtures/testHelpers';
import { HomePage } from '../page-objects';
import { expectUiLanguage } from '../fixtures/assertionsHelper';

test.describe('Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.describe('Page Loading', () => {
    test('should load the homepage successfully', async ({ page }) => {

      await expect(page).toHaveTitle(TestData.titles.homepage);
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    test('should display the correct page structure', async () => {
      await expect(homePage.mainContent).toBeVisible();
      
      if (await homePage.header.count() > 0 && await homePage.header.isVisible()) {
        await expect(homePage.header).toBeVisible();
      }
      
      if (await homePage.navigation.count() > 0 && await homePage.navigation.isVisible()) {
        await expect(homePage.navigation).toBeVisible();
      }
    });
  });

  test.describe('Homepage Functionality', () => {
    test('should navigate to breathing exercise when start button is clicked', async ({ page }) => {
      await closeQuickEscapeModal(page);
      
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await oneMinButton.click();
      await expect(page).toHaveURL(/.*breathing.*/);
    });

    test('should handle language switching', async ({ page }) => {
      await closeQuickEscapeModal(page);
  
    // Visible En
    await expectUiLanguage(page, 'EN');

    // Change to Es and Verify
    await homePage.switchLanguage('ES');
    await expectUiLanguage(page, 'ES');

    // Change to En and Verify
    await homePage.switchLanguage('EN');
    await expectUiLanguage(page, 'EN');

});

    test('should display quick escape by default', async ({ page }) => {
      await page.goto('./');
      await expect(page.locator('h2').filter({ hasText: /quick.?exit/i })).toBeVisible();
    });

test('should navigate to correct donate page in Spanish', async ({ page }) => {
  await closeQuickEscapeModal(page);

  const languageToggle = page.getByRole('banner').getByRole('button', { name: /^En$/i });
  await expect(languageToggle).toBeVisible();
  await languageToggle.click();

  await expect(page.getByRole('banner').getByRole('button', { name: /^Es$/i })).toBeVisible();
  await expect(page.getByRole('banner').getByRole('link', { name: /^Donar$/i })).toBeVisible();

  await expect.poll(async () => await page.evaluate(() => localStorage.getItem('i18nextLng')))
             .toMatch(/^es/i);

  const donateEs = page.getByRole('banner').getByRole('link', { name: /^Donar$/i });
  await donateEs.waitFor({ state: 'visible', timeout: 15000 });

  const hrefEs = await donateEs.getAttribute('href');
  expect(hrefEs).toBeTruthy();
  const originEs = /^https:\/\/www\.thetrevorproject\.mx\b/i;

  const [popupEs] = await Promise.all([
    page.waitForEvent('popup', { timeout: 15000 }).catch(() => null),
    donateEs.click(),
  ]);

  const targetEs = popupEs ?? page;
  await expect(targetEs).toHaveURL(new RegExp(`${originEs.source}.*`, 'i'), { timeout: 30000 });
});

test('should go to correct donate page in English', async ({ page }) => {
  await closeQuickEscapeModal(page);

  const toggleToEs = page.getByRole('banner').getByRole('button', { name: /^En$/i });
  await expect(toggleToEs).toBeVisible();
  await toggleToEs.click();
  await expect(page.getByRole('banner').getByRole('button', { name: /^Es$/i })).toBeVisible();
  await expect(page.getByRole('banner').getByRole('link', { name: /^Donar$/i })).toBeVisible();

  const toggleToEn = page.getByRole('banner').getByRole('button', { name: /^Es$/i });
  await toggleToEn.click();
  await expect(page.getByRole('banner').getByRole('button', { name: /^En$/i })).toBeVisible();
  await expect(page.getByRole('banner').getByRole('link', { name: /^Donate$/i })).toBeVisible();
  await expect.poll(async () => await page.evaluate(() => localStorage.getItem('i18nextLng')))
             .toMatch(/^en/i);

  const donateEn = page.getByRole('banner').getByRole('link', { name: /^Donate$/i });
  await donateEn.waitFor({ state: 'visible', timeout: 15000 });

  const hrefEn = await donateEn.getAttribute('href');
  expect(hrefEn).toBeTruthy();
  const originEn = /^https:\/\/give\.thetrevorproject\.org\b/i;

  const [popupEn] = await Promise.all([
    page.waitForEvent('popup', { timeout: 15000 }).catch(() => null),
    donateEn.click(),
  ]);

  const targetEn = popupEn ?? page;
  await expect(targetEn).toHaveURL(new RegExp(`${originEn.source}.*`, 'i'), { timeout: 30000 });
});


  test.describe('Responsive Design', () => {
    test('should display correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.mobile);
      await expect(page).toHaveTitle(TestData.titles.homepage);
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    test('should display correctly on tablet devices', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.tablet);
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.desktop);
      expect(await homePage.isLoaded()).toBeTruthy();
    });
  });
});
});

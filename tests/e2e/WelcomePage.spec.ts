import { test, expect } from '@playwright/test';
import TestData from '../fixtures/testData';
import { HomePage } from '../page-objects';
import en from '../../src/i18n/en';
import es from '../../src/i18n/es';

test.describe('WelcomePage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto('/?showquickescape=false');
  });

  test.describe('Info Button Functionality', () => {
    test('should display info button with correct text', async () => {
      await expect(homePage.infoButton).toBeVisible();
      await expect(homePage.infoButton).toHaveText('i');
    });

    test('should show tooltip on info button hover', async () => {
      await homePage.hoverInfoButton();
      
      const title = await homePage.getInfoButtonTitle();
      expect(title).toBeTruthy();
      expect(title!.length).toBeGreaterThan(10);
    });

    test('should toggle info text visibility when clicked', async () => {
      await expect(homePage.infoText).toHaveClass(/hidden/);
      
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toHaveClass(/visible/);
      
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toHaveClass(/hidden/);
    });

    test('should display explanation text in English', async () => {
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toBeVisible();
      
      const text = await homePage.getInfoTextContent();
      expect(text).toBe(en.Explanation478);
    });

    test('should display explanation text in Spanish when language is switched', async () => {
      await homePage.switchLanguage('ES');
      
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toBeVisible();
      
      const text = await homePage.getInfoTextContent();
      expect(text).toBe(es.Explanation478);
    });

    test('should maintain info button functionality across language switches', async () => {
      await homePage.infoButton.waitFor({ state: 'visible', timeout: 10000 });
      
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toHaveClass(/visible/, { timeout: 10000 });
      
      await homePage.switchLanguage('ES');
      await expect(homePage.infoButton).toBeVisible({ timeout: 10000 });
      await expect(homePage.infoText).toHaveClass(/visible/, { timeout: 10000 });
      
      await homePage.infoButton.waitFor({ state: 'visible', timeout: 10000 });
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toHaveClass(/hidden/, { timeout: 10000 });
      
      await homePage.infoButton.waitFor({ state: 'visible', timeout: 10000 });
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toHaveClass(/visible/, { timeout: 10000 });
    });
  });

  test.describe('Homepage Navigation', () => {
    test('should navigate to homepage when logo is clicked', async ({ page }) => {
      await expect(homePage.logo).toBeVisible();
      
      const homepageUrl = await page.evaluate(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const customHomeUrl = urlParams.get('homeUrl');
        
        if (customHomeUrl && customHomeUrl !== 'no') {
          return customHomeUrl;
        }
        return 'https://www.thetrevorproject.org/';
      });
      
      const expectedUrl = en['homepage-url'] as string;
      expect(homepageUrl).toBe(expectedUrl);
      
      const logoParent = page.locator('.Logo').locator('..');
      const cursorStyle = await logoParent.evaluate((el) => window.getComputedStyle(el).cursor);
      expect(cursorStyle).toBe('pointer');
    });

    test('should navigate to correct homepage URL in Spanish', async ({ page }) => {
      await homePage.switchLanguage('ES');
      
      await expect(homePage.logo).toBeVisible();
      
      const homepageUrl = await page.evaluate(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const customHomeUrl = urlParams.get('homeUrl');
        
        if (customHomeUrl === 'no') {
          return null;
        }
        if (customHomeUrl) {
          return customHomeUrl;
        }
        return 'https://www.thetrevorproject.mx/';
      });
      
      const expectedUrl = es['homepage-url'] as string;
      expect(homepageUrl).toBe(expectedUrl);
      
      const logoParent = page.locator('.Logo').locator('..');
      const cursorStyle = await logoParent.evaluate((el) => window.getComputedStyle(el).cursor);
      expect(cursorStyle).toBe('pointer');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display info button correctly on mobile', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.mobile);
      
      await expect(homePage.infoButton).toBeVisible();
      await expect(homePage.infoButton).toHaveText('i');
    });

    test('should display info button correctly on tablet', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.tablet);
      
      await expect(homePage.infoButton).toBeVisible();
      await expect(homePage.infoButton).toHaveText('i');
    });

    test('should display info button correctly on desktop', async ({ page }) => {
      await page.setViewportSize(TestData.viewports.desktop);
      
      await expect(homePage.infoButton).toBeVisible();
      await expect(homePage.infoButton).toHaveText('i');
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper button role and accessibility attributes', async () => {
      await expect(homePage.infoButton).toHaveAttribute('title');
      await expect(homePage.infoButton).toHaveAttribute('id', 'infoButton');
      
      await homePage.infoButton.focus();
      await expect(homePage.infoButton).toBeFocused();
    });

    test('should be keyboard accessible', async ({ page }) => {
      await homePage.infoButton.focus();
      await page.keyboard.press('Enter');
      
      await expect(homePage.infoText).toHaveClass(/visible/);
    });
  });

  test.describe('Sound Control', () => {
    test('should display sound control button on welcome page', async ({ page }) => {
      const soundControlButton = page.locator(TestData.selectors.soundControlButton);
      await expect(soundControlButton).toBeVisible({ timeout: 10000 });
    });

    test('should open sound control panel when sound button is clicked', async ({ page }) => {
      const soundControlButton = page.locator(TestData.selectors.soundControlButton);
      await expect(soundControlButton).toBeVisible({ timeout: 10000 });
      
      await soundControlButton.click();
      
      const soundPanel = page.locator(TestData.selectors.soundPanel);
      await expect(soundPanel).toBeVisible({ timeout: 5000 });
      
      await expect(soundPanel.locator('text=/Sound Settings/i')).toBeVisible();
    });

    test('should toggle individual sound controls on welcome page', async ({ page }) => {
      const soundControlButton = page.locator(TestData.selectors.soundControlButton);
      await expect(soundControlButton).toBeVisible({ timeout: 10000 });
      
      await soundControlButton.click();
      
      const soundPanel = page.locator(TestData.selectors.soundPanel);
      await expect(soundPanel).toBeVisible({ timeout: 5000 });
      
      const backgroundToggle = soundPanel.locator(TestData.selectors.backgroundToggle);
      await expect(backgroundToggle).toBeVisible();
      
      const initialChecked = await backgroundToggle.getAttribute('aria-checked');
      
      await backgroundToggle.click();
      
      await page.waitForTimeout(500);
      const newChecked = await backgroundToggle.getAttribute('aria-checked');
      expect(newChecked).not.toBe(initialChecked);
    });
  });
});

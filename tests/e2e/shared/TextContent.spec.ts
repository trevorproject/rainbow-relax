import { test, expect } from '../../fixtures/fixtures';
import { TIMEOUTS } from '../../fixtures/testConstants';
import en from '../../../src/i18n/en';
import es from '../../../src/i18n/es';

test.describe('Text Content Validation', () => {
  test('Explanation478 text content displays correctly', async ({ homePage, pageObjects }) => {
    await test.step('English explanation text', async () => {
      await homePage.waitForLoadState('networkidle');
      const homePageObj = pageObjects.homePage;
      await expect(homePageObj.infoButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      
      // Check if info text is already visible, if so click to hide first
      const isAlreadyVisible = await homePageObj.isInfoTextVisible().catch(() => false);
      if (isAlreadyVisible) {
        await homePageObj.clickInfoButton();
        await homePage.waitForTimeout(300);
      }
      
      await homePageObj.clickInfoButton();
      
      // Wait for info text to be visible
      await expect(homePageObj.infoText).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      
      const text = await homePageObj.getInfoTextContent();
      expect(text).toBe(en.Explanation478);
    });

    await test.step('Spanish explanation text', async () => {
      const homePageObj = pageObjects.homePage;
      await homePageObj.switchLanguage('ES' as 'EN' | 'ES');
      await homePage.waitForTimeout(500);
      
      const isInfoTextVisible = await homePageObj.infoText.isVisible().catch(() => false);
      if (isInfoTextVisible) {
        await homePageObj.clickInfoButton();
        await homePage.waitForTimeout(300);
      }
      
      await expect(homePageObj.infoButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      await homePageObj.clickInfoButton();
      
      // Wait for info text to be visible
      await expect(homePageObj.infoText).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      
      const text = await homePageObj.getInfoTextContent();
      expect(text).toBe(es.Explanation478);
    });

    await test.step('Text has consistent length and formatting', async () => {
      const englishExplanation = en.Explanation478 as string;
      const spanishExplanation = es.Explanation478 as string;
      
      const englishLength = englishExplanation.length;
      const spanishLength = spanishExplanation.length;
      
      expect(englishLength).toBeGreaterThan(100);
      expect(spanishLength).toBeGreaterThan(100);
      expect(spanishLength).toBeGreaterThanOrEqual(englishLength);
      
      expect(englishExplanation).toContain('\n');
      expect(spanishExplanation).toContain('\n');
      
      const englishSentences = englishExplanation.split('.').filter((s: string) => s.trim().length > 0);
      const spanishSentences = spanishExplanation.split('.').filter((s: string) => s.trim().length > 0);
      expect(englishSentences.length).toBeGreaterThan(2);
      expect(spanishSentences.length).toBeGreaterThan(2);
    });
  });

  test('Homepage text content displays correctly', async ({ homePage, pageObjects }) => {
    // Wait for page to be ready
    await homePage.waitForLoadState('networkidle');
    await test.step('Title and message in English', async () => {
      const homePageObj = pageObjects.homePage;
      await expect(homePageObj.titleText).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      const titleText = await homePageObj.getTitleTextContent();
      expect(titleText).toContain(en['title-text']);
      
      await expect(homePageObj.mainMessage).toBeVisible();
      const messageText = await homePageObj.getMainMessageContent();
      expect(messageText).toBe(en['main-message']);
    });

    await test.step('Title and message in Spanish', async () => {
      const homePageObj = pageObjects.homePage;
      await homePageObj.switchLanguage('ES' as 'EN' | 'ES');
      await expect(homePageObj.titleText).toBeVisible();
      const titleText = await homePageObj.getTitleTextContent();
      expect(titleText).toContain(es['title-text']);
      
      await expect(homePageObj.mainMessage).toBeVisible();
      const messageText = await homePageObj.getMainMessageContent();
      expect(messageText).toBe(es['main-message']);
    });
  });

  // Parameterized test for donate URLs
  [
    { lang: 'English', switchTo: null, expectedUrl: en['donate-url'] },
    { lang: 'Spanish', switchTo: 'ES', expectedUrl: es['donate-url'] },
  ].forEach(({ lang, switchTo, expectedUrl }) => {
    test(`Donate URL is correct in ${lang}`, async ({ pageObjects, homePage }) => {
      // Verify homepage is ready
      await expect(homePage).toHaveURL('/');
      
      const homePageObj = pageObjects.homePage;
      if (switchTo) {
        await homePageObj.switchLanguage(switchTo as 'EN' | 'ES');
      }
      const donateButton = switchTo ? homePageObj.donateButtonEs : homePageObj.donateButtonEn;
      await expect(donateButton).toBeVisible();
      const href = await donateButton.getAttribute('href');
      expect(href).toBe(expectedUrl);
    });
  });
});

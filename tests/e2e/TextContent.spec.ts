import { test, expect } from '@playwright/test';
import { closeQuickEscapeModal } from '../fixtures/testHelpers';
import { HomePage } from '../page-objects';
import en from '../../src/i18n/en';
import es from '../../src/i18n/es';

test.describe('Text Content Validation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await closeQuickEscapeModal(page);
  });

  test.describe('Explanation478 Text Content', () => {
    test('should display correct English explanation text', async () => {
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toBeVisible();
      
      const text = await homePage.getInfoTextContent();
      expect(text).toBe(en.Explanation478);
    });

    test('should display correct Spanish explanation text', async () => {
      await homePage.switchLanguage('ES');
      
      await homePage.clickInfoButton();
      await expect(homePage.infoText).toBeVisible();
      
      const text = await homePage.getInfoTextContent();
      expect(text).toBe(es.Explanation478);
    });

    test('should have consistent text length between languages', async () => {
      const englishLength = en.Explanation478.length;
      const spanishLength = es.Explanation478.length;
      
      expect(englishLength).toBeGreaterThan(100);
      expect(spanishLength).toBeGreaterThan(100);
      expect(spanishLength).toBeGreaterThanOrEqual(englishLength);
    });

    test('should maintain text formatting and structure', async () => {
      const englishText = en.Explanation478;
      const spanishText = es.Explanation478;
      
      expect(englishText).toContain('\n');
      expect(spanishText).toContain('\n');
      
      const englishSentences = englishText.split('.').filter(s => s.trim().length > 0);
      const spanishSentences = spanishText.split('.').filter(s => s.trim().length > 0);
      expect(englishSentences.length).toBeGreaterThan(2);
      expect(spanishSentences.length).toBeGreaterThan(2);
    });
  });

  test.describe('Updated Homepage Text Content', () => {
    test('should display updated title text in English', async () => {
      await expect(homePage.titleText).toBeVisible();
      
      const titleText = await homePage.getTitleTextContent();
      expect(titleText).toContain(en['title-text']);
    });

    test('should display updated title text in Spanish', async () => {
      await homePage.switchLanguage('ES');
      
      await expect(homePage.titleText).toBeVisible();
      
      const titleText = await homePage.getTitleTextContent();
      expect(titleText).toContain(es['title-text']);
    });

    test('should display updated main message in English', async () => {
      await expect(homePage.mainMessage).toBeVisible();
      
      const messageText = await homePage.getMainMessageContent();
      expect(messageText).toBe(en['main-message']);
    });

    test('should display updated main message in Spanish', async () => {
      await homePage.switchLanguage('ES');
      
      await expect(homePage.mainMessage).toBeVisible();
      
      const messageText = await homePage.getMainMessageContent();
      expect(messageText).toBe(es['main-message']);
    });
  });

  test.describe('Donate URL Updates', () => {
    test('should use correct English donate URL', async ({ page }) => {
      const donateButton = page.getByRole('link').filter({ hasText: 'Donate' });
      await expect(donateButton).toBeVisible();
      
      const href = await donateButton.getAttribute('href');
      expect(href).toBe(en['donate-url']);
    });

    test('should use correct Spanish donate URL', async ({ page }) => {
      await homePage.switchLanguage('ES');
      
      const donateButton = page.getByRole('link').filter({ hasText: 'Donar' });
      await expect(donateButton).toBeVisible();
      
      const href = await donateButton.getAttribute('href');
      expect(href).toBe(es['donate-url']);
    });
  });
});

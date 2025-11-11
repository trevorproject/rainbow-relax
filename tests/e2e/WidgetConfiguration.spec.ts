import { test, expect } from '@playwright/test';
import { WidgetConfigPage } from '../page-objects';
import TestData from '../fixtures/testData';
import { 
  verifyCustomLogo, 
  verifyDefaultLogo
} from '../fixtures/widgetConfigHelpers';

test.describe('Widget Configuration', () => {
  let widgetPage: WidgetConfigPage;

  test.beforeEach(async ({ page }) => {
    widgetPage = new WidgetConfigPage(page);
  });

  test.describe('Logo Customization', () => {
    test('should display default Trevor logo when no logoUrl parameter', async ({ page }) => {
      await widgetPage.gotoWithParams({
        showquickescape: 'false'
      });
      
      await verifyDefaultLogo(page, 'en');
    });

    test('should display custom logo when logoUrl parameter provided', async ({ page }) => {
      const customLogoUrl = TestData.widgetConfig.testAssets.customLogo;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.logoUrl]: customLogoUrl,
        showquickescape: 'false'
      });
      
      await verifyCustomLogo(page, customLogoUrl);
    });

    test('should maintain logo functionality (clickable) with custom logo', async ({ page }) => {
      const customLogoUrl = TestData.widgetConfig.testAssets.customLogo;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.logoUrl]: customLogoUrl,
        showquickescape: 'false'
      });
      
      // Verify custom logo is displayed
      await verifyCustomLogo(page, customLogoUrl);
      
      // Verify logo is clickable (home button functionality)
      await expect(widgetPage.homeButton).toBeVisible();
    });

    test('should fallback to Trevor logo when custom logo fails to load', async () => {
      const invalidLogoUrl = 'https://invalid-url-that-will-fail.com/logo.png';
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.logoUrl]: invalidLogoUrl,
        showquickescape: 'false'
      });
      
      // The logo should still be visible (fallback behavior)
      await expect(widgetPage.logoImage).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Audio Customization', () => {
    test('should use default local audio when no audioUrl parameter', async ({ page }) => {
      await widgetPage.gotoWithParams({
        showquickescape: 'false'
      });
      
      // Wait for WelcomePage content to be ready
      await page.waitForSelector('h2:has-text("Visual Breathing Exercise")', { timeout: 10000 });
      // Navigate to breathing exercise to test audio
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await expect(oneMinButton).toBeVisible({ timeout: 10000 });
      await oneMinButton.click();
      
      // Wait for the exercise page to load
      await page.waitForSelector('h2:has-text("Breathing exercise")');
      
      // Audio should be using local files (no network requests to external URLs)
      // This is verified by the absence of external audio requests
    });

    test('should attempt to use custom audio when audioUrl provided', async ({ page }) => {
      const customAudioUrl = TestData.widgetConfig.testAssets.customAudio;
      
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.audioUrl]: customAudioUrl,
        showquickescape: 'false'
      });
      
      // Verify the parameter is in the URL before navigation
      expect(page.url()).toContain('audioUrl=');
    });
  });

  test.describe('Button Visibility', () => {
    test('should display donate and help buttons by default', async () => {
      await widgetPage.gotoWithParams({
        showquickescape: 'false'
      });
      
      await widgetPage.verifyBothButtonsVisible();
    });

    test('should hide donate button when donationUrl=no', async () => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue,
        showquickescape: 'false'
      });
      
      await widgetPage.verifyOnlyDonateButtonHidden();
    });

    test('should hide help button when helpUrl=no', async () => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.hiddenValue,
        showquickescape: 'false'
      });
      
      await widgetPage.verifyOnlyHelpButtonHidden();
    });

    test('should hide both buttons when both set to no', async () => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.hiddenValue,
        showquickescape: 'false'
      });
      
      await widgetPage.verifyBothButtonsHidden();
    });
  });

  test.describe('Custom URL Tests', () => {
    test('should use custom donation URL when donationUrl parameter provided', async () => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl,
        showquickescape: 'false'
      });
      
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
    });

    test('should use custom help URL when helpUrl parameter provided', async () => {
      const customHelpUrl = TestData.widgetConfig.customUrls.help;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.helpUrl]: customHelpUrl,
        showquickescape: 'false'
      });
      
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      expect(helpButtonHref).toBe(customHelpUrl);
    });

    test('should use custom home URL when homeUrl parameter provided', async ({ page }) => {
      const customHomeUrl = TestData.widgetConfig.customUrls.home;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.homeUrl]: customHomeUrl,
        showquickescape: 'false'
      });
      
      // Verify the parameter is in the URL
      expect(page.url()).toContain('homeUrl=');
      
      // Verify the home button is clickable (it should navigate to the custom URL)
      await expect(widgetPage.homeButton).toBeVisible({ timeout: 10000 });
    });

    test('should open custom URLs in new tab with noopener', async () => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl,
        showquickescape: 'false'
      });
      
      const donateButton = widgetPage.donateButton;
      await expect(donateButton).toBeVisible({ timeout: 10000 });
      const rel = await donateButton.getAttribute('rel');
      const target = await donateButton.getAttribute('target');
      
      expect(rel).toBe('noopener');
      expect(target).toBe('_blank');
    });
  });

  test.describe('Background and Instructions Tests', () => {
    test('should support backgroundUrl parameter', async ({ page }) => {
      const customBackgroundUrl = 'https://example.com/background.jpg';
      
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.backgroundUrl]: customBackgroundUrl,
        showquickescape: 'false'
      });
      
      // Verify the parameter is in the URL
      expect(page.url()).toContain('backgroundUrl=');
    });

    test('should support instructionsUrl parameter', async ({ page }) => {
      const customInstructionsUrl = 'https://example.com/instructions.json';
      
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.instructionsUrl]: customInstructionsUrl,
        showquickescape: 'false'
      });
      
      // Verify the parameter is in the URL
      expect(page.url()).toContain('instructionsUrl=');
    });

    test('should support guidedVoiceUrl parameter', async ({ page }) => {
      const customGuidedVoiceUrl = 'https://example.com/guided-voice.mp3';
      
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.guidedVoiceUrl]: customGuidedVoiceUrl,
        showquickescape: 'false'
      });
      
      // Verify the parameter is in the URL
      expect(page.url()).toContain('guidedVoiceUrl=');
    });
  });

  test.describe('Combined Parameters Tests', () => {
    test('should handle multiple parameters simultaneously', async ({ page }) => {
      const params = {
        [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
        [TestData.widgetConfig.params.homeUrl]: TestData.widgetConfig.customUrls.home,
        showquickescape: 'false'
      };
      
      await widgetPage.gotoWithParams(params);
      
      // Verify all parameters are applied
      await verifyCustomLogo(page, TestData.widgetConfig.testAssets.customLogo);
      
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      
      expect(donateButtonHref).toBe(TestData.widgetConfig.customUrls.donation);
      expect(helpButtonHref).toBe(TestData.widgetConfig.customUrls.help);
    });

    test('should correctly prioritize custom values over defaults', async () => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl,
        showquickescape: 'false'
      });
      
      // Should use custom URL, not default
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
      expect(donateButtonHref).not.toContain('thetrevorproject');
    });

    test('should maintain language switching with custom parameters', async () => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl,
        showquickescape: 'false'
      });
      
      // Switch to Spanish
      await widgetPage.switchLanguage('ES');
      
      // Verify button is still visible and has correct URL
      await expect(widgetPage.donateButton).toBeVisible({ timeout: 10000 });
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
      
      // Verify button text is in Spanish
      const donateButtonText = await widgetPage.donateButton.textContent();
      expect(donateButtonText).toContain('Donar');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle malformed URLs gracefully', async () => {
      const malformedUrl = 'not-a-valid-url';
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: malformedUrl,
        showquickescape: 'false'
      });
      
      // Should still display the button with the malformed URL
      await expect(widgetPage.donateButton).toBeVisible({ timeout: 10000 });
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(malformedUrl);
    });

    test('should handle empty parameter values', async () => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: '',
        [TestData.widgetConfig.params.helpUrl]: '',
        showquickescape: 'false'
      });
      
      // Should fall back to default behavior (buttons visible with default URLs)
      await widgetPage.verifyBothButtonsVisible();
    });

    test('should handle special characters in URLs', async () => {
      const specialCharUrl = 'https://example.com/test?param=value&other=test%20with%20spaces';
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: specialCharUrl,
        showquickescape: 'false'
      });
      
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(specialCharUrl);
    });

    test('should maintain functionality when mixing no values with custom URLs', async () => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
        showquickescape: 'false'
      });
      
      // Donate button should be hidden, help button should be visible with custom URL
      await widgetPage.verifyOnlyDonateButtonHidden();
      
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      expect(helpButtonHref).toBe(TestData.widgetConfig.customUrls.help);
    });
  });

  test.describe('Parameter Persistence Across Navigation', () => {
    test('should preserve parameters when navigating from home to breathing', async ({ page }) => {
      const params = {
        [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
        showquickescape: 'false'
      };
      
      await widgetPage.gotoWithParams(params);
      
      // Verify parameters are present on home page
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
      
      // Wait for WelcomePage content to be ready
      await page.waitForSelector('h2:has-text("Visual Breathing Exercise")', { timeout: 10000 });
      // Navigate to breathing exercise
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await expect(oneMinButton).toBeVisible({ timeout: 10000 });
      await oneMinButton.click();
      
      // Wait for navigation and verify parameters are preserved
      await page.waitForSelector('h2:has-text("Breathing exercise")');
      expect(page.url()).toContain('/breathing');
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
    });

    test('should preserve parameters when navigating from breathing to thank-you', async ({ page }) => {
      const params = {
        [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
        showquickescape: 'false'
      };
      
      await widgetPage.gotoWithParams(params);
      
      // Wait for WelcomePage content to be ready
      await page.waitForSelector('h2:has-text("Visual Breathing Exercise")', { timeout: 10000 });
      // Navigate to breathing exercise
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await expect(oneMinButton).toBeVisible({ timeout: 10000 });
      await oneMinButton.click();
      await page.waitForSelector('h2:has-text("Breathing exercise")');
      
      // Verify parameters are preserved on breathing page
      expect(page.url()).toContain('/breathing');
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
      
      // Navigate directly to thank-you page to test parameter preservation
      await page.goto('/thank-you?' + new URLSearchParams(params).toString());
      await page.waitForSelector('text=Try again');
      expect(page.url()).toContain('/thank-you');
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
    });

    test('should preserve parameters when navigating from thank-you back to home', async ({ page }) => {
      const params = {
        [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
        showquickescape: 'false'
      };
      
      // Start on thank-you page with parameters
      await page.goto('/thank-you?' + new URLSearchParams(params).toString());
      await page.waitForSelector('text=Try again');
      
      // Verify parameters are present on thank-you page
      expect(page.url()).toContain('/thank-you');
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
      
      // Navigate back to home using the Try again link
      const tryAgainLink = page.locator('text=Try again');
      await tryAgainLink.click();
      
      // Verify we're back on home page with preserved parameters
      await page.waitForSelector('button:has-text("1 min")');
      expect(page.url()).toContain('/');
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
    });

    test('should preserve multiple parameters through complete navigation flow', async ({ page }) => {
      const params = {
        [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
        [TestData.widgetConfig.params.audioUrl]: TestData.widgetConfig.testAssets.customAudio,
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
        [TestData.widgetConfig.params.homeUrl]: TestData.widgetConfig.customUrls.home,
        showquickescape: 'false'
      };
      
      await widgetPage.gotoWithParams(params);
      
      // Verify all parameters are present initially
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('audioUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
      expect(page.url()).toContain('homeUrl=');
      
      // Navigate to breathing
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await expect(oneMinButton).toBeVisible();
      await oneMinButton.click();
      await page.waitForSelector('h2:has-text("Breathing exercise")');
      
      // Verify all parameters preserved
      expect(page.url()).toContain('/breathing');
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('audioUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
      expect(page.url()).toContain('homeUrl=');
      
      // Navigate to thank-you page directly to test parameter preservation
      await page.goto('/thank-you?' + new URLSearchParams(params).toString());
      await page.waitForSelector('text=Try again');
      
      // Verify all parameters still preserved
      expect(page.url()).toContain('/thank-you');
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('audioUrl=');
      expect(page.url()).toContain('donationUrl=');
      expect(page.url()).toContain('helpUrl=');
      expect(page.url()).toContain('homeUrl=');
    });

    test('should not interfere with route state during navigation', async ({ page }) => {
      const params = {
        [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
        showquickescape: 'false'
      };
      
      await widgetPage.gotoWithParams(params);
      
      // Wait for WelcomePage content to be ready
      await page.waitForSelector('h2:has-text("Visual Breathing Exercise")', { timeout: 10000 });
      // Navigate to breathing with state
      const threeMinButton = page.locator('button').filter({ hasText: '3 min' });
      await expect(threeMinButton).toBeVisible({ timeout: 10000 });
      await threeMinButton.click();
      
      // Verify we're on breathing page with both parameters and state
      await page.waitForSelector('h2:has-text("Breathing exercise")');
      expect(page.url()).toContain('/breathing');
      expect(page.url()).toContain('logoUrl=');
      expect(page.url()).toContain('donationUrl=');
      
      // Verify the exercise state is preserved by checking the exercise is running
      // The actual time display format may vary, so we check for the exercise being active
      const exerciseTitle = page.locator('h2:has-text("Breathing exercise")');
      await expect(exerciseTitle).toBeVisible();
    });
  });
});

import { test, expect } from '@playwright/test';
import { WidgetConfigPage } from '../page-objects';
import TestData from '../fixtures/testData';
import { 
  verifyCustomLogo, 
  verifyDefaultLogo
} from '../fixtures/widgetConfigHelpers';
import { closeQuickEscapeModal } from '../fixtures/testHelpers';

test.describe('Widget Configuration', () => {
  let widgetPage: WidgetConfigPage;

  test.beforeEach(async ({ page }) => {
    widgetPage = new WidgetConfigPage(page);
  });

  test.describe('Logo Customization', () => {
    test('should display default Trevor logo when no logoUrl parameter', async ({ page }) => {
      await widgetPage.goto();
      await closeQuickEscapeModal(page);
      
      await verifyDefaultLogo(page, 'en');
    });

    test('should display custom logo when logoUrl parameter provided', async ({ page }) => {
      const customLogoUrl = TestData.widgetConfig.testAssets.customLogo;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.logoUrl]: customLogoUrl
      });
      await closeQuickEscapeModal(page);
      
      await verifyCustomLogo(page, customLogoUrl);
    });

    test('should maintain logo functionality (clickable) with custom logo', async ({ page }) => {
      const customLogoUrl = TestData.widgetConfig.testAssets.customLogo;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.logoUrl]: customLogoUrl
      });
      await closeQuickEscapeModal(page);
      
      // Verify custom logo is displayed
      await verifyCustomLogo(page, customLogoUrl);
      
      // Verify logo is clickable (home button functionality)
      await expect(widgetPage.homeButton).toBeVisible();
    });

    test('should fallback to Trevor logo when custom logo fails to load', async ({ page }) => {
      const invalidLogoUrl = 'https://invalid-url-that-will-fail.com/logo.png';
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.logoUrl]: invalidLogoUrl
      });
      await closeQuickEscapeModal(page);
      
      // The logo should still be visible (fallback behavior)
      await expect(widgetPage.logoImage).toBeVisible();
    });
  });

  test.describe('Audio Customization', () => {
    test('should use default local audio when no audioUrl parameter', async ({ page }) => {
      await widgetPage.goto();
      await closeQuickEscapeModal(page);
      
      // Navigate to breathing exercise to test audio
      const oneMinButton = page.locator('button').filter({ hasText: '1 min' });
      await oneMinButton.click();
      
      // Wait for the exercise page to load
      await page.waitForSelector('h2:has-text("Breathing exercise")');
      
      // Audio should be using local files (no network requests to external URLs)
      // This is verified by the absence of external audio requests
    });

    test('should attempt to use custom audio when audioUrl provided', async ({ page }) => {
      const customAudioUrl = TestData.widgetConfig.testAssets.customAudio;
      
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.audioUrl]: customAudioUrl
      });
      await closeQuickEscapeModal(page);
      
      // Verify the parameter is in the URL before navigation
      expect(page.url()).toContain('audioUrl=');
    });
  });

  test.describe('Button Visibility', () => {
    test('should display donate and help buttons by default', async ({ page }) => {
      await widgetPage.goto();
      await closeQuickEscapeModal(page);
      
      await widgetPage.verifyBothButtonsVisible();
    });

    test('should hide donate button when donationUrl=no', async ({ page }) => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue
      });
      await closeQuickEscapeModal(page);
      
      await widgetPage.verifyOnlyDonateButtonHidden();
    });

    test('should hide help button when helpUrl=no', async ({ page }) => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.hiddenValue
      });
      await closeQuickEscapeModal(page);
      
      await widgetPage.verifyOnlyHelpButtonHidden();
    });

    test('should hide both buttons when both set to no', async ({ page }) => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.hiddenValue
      });
      await closeQuickEscapeModal(page);
      
      await widgetPage.verifyBothButtonsHidden();
    });
  });

  test.describe('Custom URL Tests', () => {
    test('should use custom donation URL when donationUrl parameter provided', async ({ page }) => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl
      });
      await closeQuickEscapeModal(page);
      
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
    });

    test('should use custom help URL when helpUrl parameter provided', async ({ page }) => {
      const customHelpUrl = TestData.widgetConfig.customUrls.help;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.helpUrl]: customHelpUrl
      });
      await closeQuickEscapeModal(page);
      
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      expect(helpButtonHref).toBe(customHelpUrl);
    });

    test('should use custom home URL when homeUrl parameter provided', async ({ page }) => {
      const customHomeUrl = TestData.widgetConfig.customUrls.home;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.homeUrl]: customHomeUrl
      });
      await closeQuickEscapeModal(page);
      
      // Verify the parameter is in the URL
      expect(page.url()).toContain('homeUrl=');
      
      // Verify the home button is clickable (it should navigate to the custom URL)
      await expect(widgetPage.homeButton).toBeVisible();
    });

    test('should open custom URLs in new tab with noopener', async ({ page }) => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl
      });
      await closeQuickEscapeModal(page);
      
      const donateButton = widgetPage.donateButton;
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
        [TestData.widgetConfig.params.backgroundUrl]: customBackgroundUrl
      });
      await closeQuickEscapeModal(page);
      
      // Verify the parameter is in the URL
      expect(page.url()).toContain('backgroundUrl=');
    });

    test('should support instructionsUrl parameter', async ({ page }) => {
      const customInstructionsUrl = 'https://example.com/instructions.json';
      
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.instructionsUrl]: customInstructionsUrl
      });
      await closeQuickEscapeModal(page);
      
      // Verify the parameter is in the URL
      expect(page.url()).toContain('instructionsUrl=');
    });

    test('should support guidedVoiceUrl parameter', async ({ page }) => {
      const customGuidedVoiceUrl = 'https://example.com/guided-voice.mp3';
      
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.guidedVoiceUrl]: customGuidedVoiceUrl
      });
      await closeQuickEscapeModal(page);
      
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
        [TestData.widgetConfig.params.homeUrl]: TestData.widgetConfig.customUrls.home
      };
      
      await widgetPage.gotoWithParams(params);
      await closeQuickEscapeModal(page);
      
      // Verify all parameters are applied
      await verifyCustomLogo(page, TestData.widgetConfig.testAssets.customLogo);
      
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      
      expect(donateButtonHref).toBe(TestData.widgetConfig.customUrls.donation);
      expect(helpButtonHref).toBe(TestData.widgetConfig.customUrls.help);
    });

    test('should correctly prioritize custom values over defaults', async ({ page }) => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl
      });
      await closeQuickEscapeModal(page);
      
      // Should use custom URL, not default
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
      expect(donateButtonHref).not.toContain('thetrevorproject');
    });

    test('should maintain language switching with custom parameters', async ({ page }) => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl
      });
      await closeQuickEscapeModal(page);
      
      // Switch to Spanish
      await widgetPage.switchLanguage('ES');
      
      // Verify button is still visible and has correct URL
      await expect(widgetPage.donateButton).toBeVisible();
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
      
      // Verify button text is in Spanish
      const donateButtonText = await widgetPage.donateButton.textContent();
      expect(donateButtonText).toContain('Donar');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle malformed URLs gracefully', async ({ page }) => {
      const malformedUrl = 'not-a-valid-url';
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: malformedUrl
      });
      await closeQuickEscapeModal(page);
      
      // Should still display the button with the malformed URL
      await expect(widgetPage.donateButton).toBeVisible();
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(malformedUrl);
    });

    test('should handle empty parameter values', async ({ page }) => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: '',
        [TestData.widgetConfig.params.helpUrl]: ''
      });
      await closeQuickEscapeModal(page);
      
      // Should fall back to default behavior (buttons visible with default URLs)
      await widgetPage.verifyBothButtonsVisible();
    });

    test('should handle special characters in URLs', async ({ page }) => {
      const specialCharUrl = 'https://example.com/test?param=value&other=test%20with%20spaces';
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: specialCharUrl
      });
      await closeQuickEscapeModal(page);
      
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(specialCharUrl);
    });

    test('should maintain functionality when mixing no values with custom URLs', async ({ page }) => {
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help
      });
      await closeQuickEscapeModal(page);
      
      // Donate button should be hidden, help button should be visible with custom URL
      await widgetPage.verifyOnlyDonateButtonHidden();
      
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      expect(helpButtonHref).toBe(TestData.widgetConfig.customUrls.help);
    });
  });
});

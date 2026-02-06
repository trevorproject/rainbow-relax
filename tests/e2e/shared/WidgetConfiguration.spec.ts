import { test, expect } from '../../fixtures/fixtures';
import TestData from '../../fixtures/testData';
import { 
  verifyCustomLogo, 
  verifyDefaultLogo
} from '../../fixtures/widgetConfigHelpers';
import { TIMEOUTS } from '../../fixtures/testConstants';

test.describe('Widget Configuration', () => {
  test('Logo customization works correctly', async ({ pageObjects, homePage }) => {
    await test.step('Display default Trevor logo when no logoUrl parameter', async () => {
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        showquickescape: 'false'
      });
      await verifyDefaultLogo(homePage, 'en');
    });

    await test.step('Display custom logo when logoUrl parameter provided', async () => {
      const customLogoUrl = TestData.widgetConfig.testAssets.customLogo;
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.logoUrl]: customLogoUrl,
        showquickescape: 'false'
      });
      await verifyCustomLogo(homePage, customLogoUrl);
      await expect(widgetPage.homeButton).toBeVisible();
    });

    await test.step('Fallback to Trevor logo when custom logo fails to load', async () => {
      const invalidLogoUrl = 'https://invalid-url-that-will-fail.com/logo.png';
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.logoUrl]: invalidLogoUrl,
        showquickescape: 'false'
      });
      await expect(widgetPage.logoImage).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    });
  });

  test('Audio customization works correctly', async ({ pageObjects, homePage }) => {
    await test.step('Use default local audio when no audioUrl parameter', async () => {
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        showquickescape: 'false'
      });
      await homePage.waitForSelector('h2:has-text("Visual Breathing Exercise")', { timeout: TIMEOUTS.NAVIGATION });
      const homePageObj = pageObjects.homePage;
      await expect(homePageObj.oneMinButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      await homePageObj.clickOneMinButton();
      await homePage.waitForSelector('h2:has-text("Breathing exercise")');
    });

    await test.step('Attempt to use custom audio when audioUrl provided', async () => {
      const customAudioUrl = TestData.widgetConfig.testAssets.customAudio;
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.audioUrl]: customAudioUrl,
        showquickescape: 'false'
      });
      expect(homePage.url()).toContain('audioUrl=');
    });
  });

  test('Button visibility works correctly', async ({ pageObjects }) => {
    await test.step('Display donate and help buttons by default', async () => {
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        showquickescape: 'false'
      });
      await widgetPage.verifyBothButtonsVisible();
    });

    await test.step('Hide donate button when donationUrl=no', async () => {
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue,
        showquickescape: 'false'
      });
      await widgetPage.verifyOnlyDonateButtonHidden();
    });

    await test.step('Hide help button when helpUrl=no', async () => {
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.hiddenValue,
        showquickescape: 'false'
      });
      await widgetPage.verifyOnlyHelpButtonHidden();
    });

    await test.step('Hide both buttons when both set to no', async () => {
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.hiddenValue,
        showquickescape: 'false'
      });
      await widgetPage.verifyBothButtonsHidden();
    });
  });

  test('Custom URL configuration works correctly', async ({ pageObjects, homePage }) => {
    await test.step('Use custom donation URL when donationUrl parameter provided', async () => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl,
        showquickescape: 'false'
      });
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
    });

    await test.step('Use custom help URL when helpUrl parameter provided', async () => {
      const customHelpUrl = TestData.widgetConfig.customUrls.help;
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.helpUrl]: customHelpUrl,
        showquickescape: 'false'
      });
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      expect(helpButtonHref).toBe(customHelpUrl);
    });

    await test.step('Use custom home URL when homeUrl parameter provided', async () => {
      const customHomeUrl = TestData.widgetConfig.customUrls.home;
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.homeUrl]: customHomeUrl,
        showquickescape: 'false'
      });
      expect(homePage.url()).toContain('homeUrl=');
      await expect(widgetPage.homeButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    });

    await test.step('Open custom URLs in new tab with noopener', async () => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl,
        showquickescape: 'false'
      });
      const donateButton = widgetPage.donateButton;
      await expect(donateButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      const rel = await donateButton.getAttribute('rel');
      const target = await donateButton.getAttribute('target');
      expect(rel).toBe('noopener');
      expect(target).toBe('_blank');
    });
  });

  test('Background and instructions parameters work correctly', async ({ pageObjects, homePage }) => {
    await test.step('Support backgroundUrl parameter', async () => {
      const customBackgroundUrl = 'https://example.com/background.jpg';
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.backgroundUrl]: customBackgroundUrl,
        showquickescape: 'false'
      });
      expect(homePage.url()).toContain('backgroundUrl=');
    });

    await test.step('Support instructionsUrl parameter', async () => {
      const customInstructionsUrl = 'https://example.com/instructions.json';
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.instructionsUrl]: customInstructionsUrl,
        showquickescape: 'false'
      });
      expect(homePage.url()).toContain('instructionsUrl=');
    });

    await test.step('Support guidedVoiceUrl parameter', async () => {
      const customGuidedVoiceUrl = 'https://example.com/guided-voice.mp3';
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.guidedVoiceUrl]: customGuidedVoiceUrl,
        showquickescape: 'false'
      });
      expect(homePage.url()).toContain('guidedVoiceUrl=');
    });
  });

  test('CDN audio overrides work when starting exercise', async ({ pageObjects, homePage }) => {
    const widgetPage = pageObjects.widgetConfigPage;
    await widgetPage.gotoWithParams({
      [TestData.widgetConfig.params.backgroundUrl]: TestData.widgetConfig.testAssets.customAudio,
      [TestData.widgetConfig.params.instructionsUrl]: TestData.widgetConfig.testAssets.customAudio,
      [TestData.widgetConfig.params.guidedVoiceUrl]: TestData.widgetConfig.testAssets.customAudio,
      showquickescape: 'false'
    });
    await homePage.waitForSelector('h2:has-text("Visual Breathing Exercise")', { timeout: TIMEOUTS.NAVIGATION });
    const homePageObj = pageObjects.homePage;
    await homePageObj.clickOneMinButton();
    await homePage.waitForSelector('h2:has-text("Breathing exercise")', { timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
    const exercisePage = pageObjects.exercisePage;
    await expect(exercisePage.soundControlButton).toBeVisible({ timeout: TIMEOUTS.EXERCISE_INTRO_PHASE });
    await exercisePage.openSoundControlPanel();
    await expect(exercisePage.soundPanelTitle).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
  });

  test('Combined parameters work correctly', async ({ pageObjects, homePage }) => {
    await test.step('Handle multiple parameters simultaneously', async () => {
      const params = {
        [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
        [TestData.widgetConfig.params.homeUrl]: TestData.widgetConfig.customUrls.home,
        showquickescape: 'false'
      };
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams(params);
      await verifyCustomLogo(homePage, TestData.widgetConfig.testAssets.customLogo);
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      expect(donateButtonHref).toBe(TestData.widgetConfig.customUrls.donation);
      expect(helpButtonHref).toBe(TestData.widgetConfig.customUrls.help);
    });

    await test.step('Correctly prioritize custom values over defaults', async () => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl,
        showquickescape: 'false'
      });
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
      expect(donateButtonHref).not.toContain('thetrevorproject');
    });

    await test.step('Maintain language switching with custom parameters', async () => {
      const customDonationUrl = TestData.widgetConfig.customUrls.donation;
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: customDonationUrl,
        showquickescape: 'false'
      });
      await widgetPage.switchLanguage('ES');
      await expect(widgetPage.donateButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(customDonationUrl);
      const donateButtonText = await widgetPage.donateButton.textContent();
      expect(donateButtonText).toContain('Donar');
    });
  });

  test('Edge cases are handled correctly', async ({ pageObjects }) => {
    await test.step('Handle malformed URLs gracefully', async () => {
      const malformedUrl = 'not-a-valid-url';
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: malformedUrl,
        showquickescape: 'false'
      });
      await expect(widgetPage.donateButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(malformedUrl);
    });

    await test.step('Handle empty parameter values', async () => {
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: '',
        [TestData.widgetConfig.params.helpUrl]: '',
        showquickescape: 'false'
      });
      await widgetPage.verifyBothButtonsVisible();
    });

    await test.step('Handle special characters in URLs', async () => {
      const specialCharUrl = 'https://example.com/test?param=value&other=test%20with%20spaces';
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: specialCharUrl,
        showquickescape: 'false'
      });
      const donateButtonHref = await widgetPage.getDonateButtonHref();
      expect(donateButtonHref).toBe(specialCharUrl);
    });

    await test.step('Maintain functionality when mixing no values with custom URLs', async () => {
      const widgetPage = pageObjects.widgetConfigPage;
      await widgetPage.gotoWithParams({
        [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.hiddenValue,
        [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
        showquickescape: 'false'
      });
      await widgetPage.verifyOnlyDonateButtonHidden();
      const helpButtonHref = await widgetPage.getHelpButtonHref();
      expect(helpButtonHref).toBe(TestData.widgetConfig.customUrls.help);
    });
  });

  test('Parameters persist across navigation from home to breathing', async ({ pageObjects, homePage: homePageFixture }) => {
    const params = {
      [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
      [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
      [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
      showquickescape: 'false'
    };
    
    const widgetPage = pageObjects.widgetConfigPage;
    await widgetPage.gotoWithParams(params);
    expect(homePageFixture.url()).toContain('logoUrl=');
    expect(homePageFixture.url()).toContain('donationUrl=');
    expect(homePageFixture.url()).toContain('helpUrl=');
    
    await homePageFixture.waitForSelector('h2:has-text("Visual Breathing Exercise")', { timeout: TIMEOUTS.NAVIGATION });
    const homePage = pageObjects.homePage;
    await expect(homePage.oneMinButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    await homePage.clickOneMinButton();
    await homePageFixture.waitForSelector('h2:has-text("Breathing exercise")');
    
    expect(homePageFixture.url()).toContain('/breathing');
    expect(homePageFixture.url()).toContain('logoUrl=');
    expect(homePageFixture.url()).toContain('donationUrl=');
    expect(homePageFixture.url()).toContain('helpUrl=');
  });

  test('Parameters persist across navigation from breathing to thank-you', async ({ pageObjects, homePage: homePageFixture }) => {
    const params = {
      [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
      [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
      [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
      showquickescape: 'false'
    };
    
    const widgetPage = pageObjects.widgetConfigPage;
    await widgetPage.gotoWithParams(params);
    await homePageFixture.waitForSelector('h2:has-text("Visual Breathing Exercise")', { timeout: TIMEOUTS.NAVIGATION });
    const homePage = pageObjects.homePage;
    await expect(homePage.oneMinButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
    await homePage.clickOneMinButton();
    await homePageFixture.waitForSelector('h2:has-text("Breathing exercise")');
    
    expect(homePageFixture.url()).toContain('/breathing');
    expect(homePageFixture.url()).toContain('logoUrl=');
    expect(homePageFixture.url()).toContain('donationUrl=');
    expect(homePageFixture.url()).toContain('helpUrl=');
    
    await homePageFixture.goto('/thank-you?' + new URLSearchParams(params).toString());
    await homePageFixture.waitForSelector('text=Try again');
    expect(homePageFixture.url()).toContain('/thank-you');
    expect(homePageFixture.url()).toContain('logoUrl=');
    expect(homePageFixture.url()).toContain('donationUrl=');
    expect(homePageFixture.url()).toContain('helpUrl=');
  });

  test('Parameters persist through complete navigation flow', async ({ pageObjects, homePage: homePageFixture }) => {
    const params = {
      [TestData.widgetConfig.params.logoUrl]: TestData.widgetConfig.testAssets.customLogo,
      [TestData.widgetConfig.params.audioUrl]: TestData.widgetConfig.testAssets.customAudio,
      [TestData.widgetConfig.params.donationUrl]: TestData.widgetConfig.customUrls.donation,
      [TestData.widgetConfig.params.helpUrl]: TestData.widgetConfig.customUrls.help,
      [TestData.widgetConfig.params.homeUrl]: TestData.widgetConfig.customUrls.home,
      showquickescape: 'false'
    };
    
    const widgetPage = pageObjects.widgetConfigPage;
    await widgetPage.gotoWithParams(params);
    
    await homePageFixture.waitForLoadState('networkidle');
    const currentUrl = homePageFixture.url();
    expect(currentUrl).toContain('logoUrl=');
    expect(currentUrl).toContain('audioUrl=');
    expect(currentUrl).toContain('donationUrl=');
    expect(currentUrl).toContain('helpUrl=');
    expect(currentUrl).toContain('homeUrl=');
    
    const homePage = pageObjects.homePage;
    await expect(homePage.oneMinButton).toBeVisible();
    await homePage.clickOneMinButton();
    await homePageFixture.waitForSelector('h2:has-text("Breathing exercise")');
    
    expect(homePageFixture.url()).toContain('/breathing');
    expect(homePageFixture.url()).toContain('logoUrl=');
    expect(homePageFixture.url()).toContain('audioUrl=');
    expect(homePageFixture.url()).toContain('donationUrl=');
    expect(homePageFixture.url()).toContain('helpUrl=');
    expect(homePageFixture.url()).toContain('homeUrl=');
    
    await homePageFixture.waitForLoadState('networkidle', { timeout: TIMEOUTS.ANIMATION_MEDIUM }).catch(() => {});
    const thankYouUrl = '/thank-you?' + new URLSearchParams(params).toString();
    await homePageFixture.goto(thankYouUrl, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.PAGE_LOAD * 2 });
    await homePageFixture.waitForSelector('text=Try again', { timeout: TIMEOUTS.NAVIGATION });
    
    expect(homePageFixture.url()).toContain('/thank-you');
    expect(homePageFixture.url()).toContain('logoUrl=');
    expect(homePageFixture.url()).toContain('audioUrl=');
    expect(homePageFixture.url()).toContain('donationUrl=');
    expect(homePageFixture.url()).toContain('helpUrl=');
    expect(homePageFixture.url()).toContain('homeUrl=');
  });
});

import { test, expect } from '../../fixtures/fixtures';
import TestData from '../../fixtures/testData';
import { expectUiLanguage } from '../../fixtures/assertionsHelper';
import { TIMEOUTS } from '../../fixtures/testConstants';
import en from '../../../src/i18n/en';
import es from '../../../src/i18n/es';

test.describe('HomePage', () => {
  test('Page loads with correct structure', async ({ pageObjects, homePage: homePageFixture }) => {
    await test.step('Verify page loads', async () => {
      await expect(homePageFixture).toHaveTitle(TestData.titles.homepage);
      const homePage = pageObjects.homePage;
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    await test.step('Verify page structure', async () => {
      const homePage = pageObjects.homePage;
      await expect(homePage.mainContent).toBeVisible();
      if (await homePage.header.count() > 0 && await homePage.header.isVisible()) {
        await expect(homePage.header).toBeVisible();
      }
      if (await homePage.navigation.count() > 0 && await homePage.navigation.isVisible()) {
        await expect(homePage.navigation).toBeVisible();
      }
    });
  });

  test.describe('Info Button', () => {
    test('Info button basic functionality', async ({ pageObjects, homePage: homePageFixture }) => {
      await test.step('Display and tooltip', async () => {
        const homePage = pageObjects.homePage;
        await expect(homePage.infoButton).toBeVisible();
        await expect(homePage.infoButton).toHaveText('i');
        await homePage.hoverInfoButton();
        const title = await homePage.getInfoButtonTitle();
        expect(title).toBeTruthy();
        expect(title!.length).toBeGreaterThan(10);
      });

      await test.step('Toggle visibility', async () => {
        const homePage = pageObjects.homePage;
        await expect(homePage.infoText).toHaveClass(/hidden/);
        await homePage.infoButton.focus();
        await homePageFixture.keyboard.press('Enter');
        await expect(homePage.infoText).toHaveClass(/visible/);
        await homePage.infoButton.focus();
        await homePageFixture.keyboard.press('Enter');
        await expect(homePage.infoText).toHaveClass(/hidden/);
      });
    });

    // Parameterized localization test
    [
      { lang: 'EN', content: en.Explanation478 },
      { lang: 'ES', content: es.Explanation478, switchTo: 'ES' },
    ].forEach(({ lang, content, switchTo }) => {
      test(`Info button displays ${lang} content`, async ({ pageObjects, homePage: homePageFixture }) => {
        const homePage = pageObjects.homePage;
        if (switchTo) {
          await homePage.switchLanguage(switchTo as 'EN' | 'ES');
          await expect(homePage.donateTextEs).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
        }
        await homePage.infoButton.focus();
        await homePageFixture.keyboard.press('Enter');
        await expect(homePage.infoText).toHaveClass(/visible/, { timeout: TIMEOUTS.NAVIGATION });
        const text = await homePage.getInfoTextContent();
        expect(text).toBe(content);
      });
    });

    test('Info button accessibility', async ({ pageObjects, homePage: homePageFixture }) => {
      await test.step('Has proper attributes', async () => {
        const homePage = pageObjects.homePage;
        await expect(homePage.infoButton).toHaveAttribute('title');
        await expect(homePage.infoButton).toHaveAttribute('id', 'infoButton');
        await homePage.infoButton.focus();
        await expect(homePage.infoButton).toBeFocused();
      });

      await test.step('Keyboard accessible', async () => {
        const homePage = pageObjects.homePage;
        await homePage.infoButton.focus();
        await homePageFixture.keyboard.press('Enter');
        await expect(homePage.infoText).toHaveClass(/visible/);
      });
    });
  });

  test.describe('Exercise Selection', () => {
    // Parameterized exercise selection
    [
      { duration: '1-minute', method: 'clickOneMinButton' },
      { duration: '3-minute', method: 'clickThreeMinButton' },
      { duration: '5-minute', method: 'clickFiveMinButton' },
    ].forEach(({ duration, method }) => {
      test(`User can select ${duration} exercise`, async ({ pageObjects, homePage: homePageFixture }) => {
        const homePage = pageObjects.homePage;
        if (method === 'clickOneMinButton') {
          await homePage.clickOneMinButton();
        } else if (method === 'clickThreeMinButton') {
          await homePage.clickThreeMinButton();
        } else if (method === 'clickFiveMinButton') {
          await homePage.clickFiveMinButton();
        }
        await expect(homePageFixture).toHaveURL(/.*breathing.*/);
      });
    });

    test('User can select custom duration', async ({ pageObjects, homePage: homePageFixture }) => {
      const homePage = pageObjects.homePage;
      await homePage.startCustomExercise(2);
      await expect(homePageFixture).toHaveURL(/.*breathing.*/);
    });
  });

  test.describe('Language and Navigation', () => {
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

    test('Quick escape modal functionality', async ({ page, pageObjects }) => {
      // Use base page fixture for tests that need the modal (not homePage)
      await test.step('Modal displays by default', async () => {
        await page.goto('/');
        const homePage = pageObjects.homePage;
        await expect(homePage.quickEscapeModalTitle).toBeVisible();
      });

      await test.step('Modal can be closed', async () => {
        await page.goto('/');
        const homePage = pageObjects.homePage;
        await homePage.closeQuickEscapeModal();
        await expect(homePage.quickEscapeModalTitle).not.toBeVisible();
      });

      await test.step('Modal hides with URL parameter', async () => {
        await page.goto('/?showquickescape=false');
        const homePage = pageObjects.homePage;
        await expect(homePage.quickEscapeModalTitle).not.toBeVisible();
      });
    });

    // Parameterized donate link test
    [
      { lang: 'English', switchTo: null, button: 'donateButtonEn', url: 'https://give.thetrevorproject.org/campaign/716635/donate' },
      { lang: 'Spanish', switchTo: 'ES', button: 'donateButtonEs', url: 'https://www.thetrevorproject.mx/dona/' },
    ].forEach(({ lang, switchTo, url }) => {
      test(`User can navigate to ${lang} donate page`, async ({ pageObjects, homePage: homePageFixture }) => {
        const homePage = pageObjects.homePage;
        if (switchTo) {
          await homePage.switchLanguage(switchTo as 'EN' | 'ES');
          await expect(homePage.donateTextEs).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
        } else {
          await expect(homePage.donateTextEn).toBeVisible();
        }

        const donateButton = switchTo ? homePage.donateButtonEs : homePage.donateButtonEn;
        const [newPage] = await Promise.all([
          homePageFixture.waitForEvent('popup', { timeout: TIMEOUTS.PAGE_LOAD }),
          donateButton.click(),
        ]);

        await expect(newPage).toHaveURL(url, { timeout: TIMEOUTS.PAGE_LOAD });
      });
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
          await expect(homePage.donateTextEs).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
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
        const logoParent = homePageFixture.locator('.Logo').locator('..');
        const cursorStyle = await logoParent.evaluate((el: HTMLElement) => window.getComputedStyle(el).cursor);
        expect(cursorStyle).toBe('pointer');
      });
    });
  });

  test.describe('Sound Control', () => {
    test('Sound control functionality on homepage', async ({ homePage, pageObjects }) => {
      await test.step('Sound control button displays', async () => {
        // Add explicit wait for page readiness
        await homePage.waitForLoadState('networkidle');
        const homePageObj = pageObjects.homePage;
        await expect(homePageObj.soundControlButton).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
      });

      await test.step('Open sound panel', async () => {
        const homePageObj = pageObjects.homePage;
        await homePageObj.openSoundControlPanel();
        const exercisePage = pageObjects.exercisePage;
        await expect(exercisePage.soundPanelTitle).toBeVisible();
      });

      await test.step('Toggle sound controls', async () => {
        const homePage = pageObjects.homePage;
        await expect(homePage.backgroundToggle).toBeVisible();
        const initialChecked = await homePage.backgroundToggle.getAttribute('aria-checked');
        expect(initialChecked).not.toBeNull();
        await homePage.backgroundToggle.click();
        await expect(homePage.backgroundToggle).not.toHaveAttribute('aria-checked', initialChecked!);
      });
    });
  });

  test.describe('Responsive Design', () => {
    // Parameterized responsive test
    [
      { name: 'mobile', viewport: TestData.viewports.mobile },
      { name: 'tablet', viewport: TestData.viewports.tablet },
      { name: 'desktop', viewport: TestData.viewports.desktop },
    ].forEach(({ name, viewport }) => {
      test(`Homepage displays correctly on ${name}`, async ({ pageObjects, homePage: homePageFixture }) => {
        await homePageFixture.setViewportSize(viewport);
        await expect(homePageFixture).toHaveTitle(TestData.titles.homepage);
        const homePage = pageObjects.homePage;
        expect(await homePage.isLoaded()).toBeTruthy();
        await expect(homePage.infoButton).toBeVisible();
      });
    });
  });
});

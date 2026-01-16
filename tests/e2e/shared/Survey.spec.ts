import { expect, test } from '../../fixtures/fixtures';

test.describe('Survey', () => {
  test('User can view and interact with feedback options', async ({ thankYouPage, pageObjects }) => {
    await test.step('Feedback options display when clicking yes', async () => {
      await thankYouPage.waitForLoadState('networkidle');
      
      const surveyPage = pageObjects.surveyPage;
      await surveyPage.waitForSurveyVisible();
      await surveyPage.waitForInviteStep();
      
      await surveyPage.clickYesButton();
      await surveyPage.waitForSurveyOptions();
    });

    await test.step('User can skip feedback', async () => {
      const context = thankYouPage.context();
      await context.addCookies([{
        name: 'cookie1',
        value: 'true',
        path: '/',
        domain: 'localhost',
        sameSite: 'Lax' as const,
        expires: Math.floor(Date.now() / 1000) + 12960000,
      }]);
      
      await thankYouPage.evaluate(() => {
        localStorage.removeItem('survey_completed');
        localStorage.removeItem('survey_completion_date');
        localStorage.setItem('rainbow-relax-bandwidth-consent', 'true');
      });
      await thankYouPage.reload();
      await thankYouPage.waitForLoadState('networkidle');
      
      const surveyPage = pageObjects.surveyPage;
      await surveyPage.waitForSurveyVisible();
      await surveyPage.clickSkipButton();
      await expect(surveyPage.skipButton).toBeHidden();
    });
  });

  [
    { button: 'Much calmer', option: 'much_more_calm' as const, result: 'Thank you for your feedback!' },
    { button: 'A bit better', option: 'a_bit_better' as const, result: 'Thank you for your feedback!' },
    { button: 'More relaxed', option: 'more_relaxed' as const, result: 'Thank you for your feedback!' },
    { button: 'I feel the same', option: 'same' as const, result: 'Thanks for sharing how you feel' }
  ].forEach((testCase) => {
    test(`User can submit feedback: ${testCase.button}`, async ({ thankYouPage, pageObjects }) => {
      const context = thankYouPage.context();
      await context.addCookies([{
        name: 'cookie1',
        value: 'true',
        path: '/',
        domain: 'localhost',
        sameSite: 'Lax' as const,
        expires: Math.floor(Date.now() / 1000) + 12960000,
      }]);
      
      await thankYouPage.evaluate(() => {
        localStorage.removeItem('survey_completed');
        localStorage.removeItem('survey_completion_date');
        localStorage.setItem('rainbow-relax-bandwidth-consent', 'true');
      });
      await thankYouPage.reload();
      await thankYouPage.waitForLoadState('networkidle');
      
      const surveyPage = pageObjects.surveyPage;
      await surveyPage.waitForSurveyVisible();
      await surveyPage.clickYesButton();
      await surveyPage.clickSurveyOption(testCase.option);
      
      await surveyPage.waitForSurveyResult(testCase.result);
      const isCompleted = await surveyPage.verifySurveyCompleted();
      expect(isCompleted).toBe(true);
    });
  });
});

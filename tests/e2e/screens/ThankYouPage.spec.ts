import { expect, test } from '../../fixtures/fixtures';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const messagesPath = join(__dirname, '../../../src/assets/messages.json');
const messages = JSON.parse(readFileSync(messagesPath, 'utf-8'));

test.describe('ThankYouPage', () => {
  test('User sees an affirmative message on thank you page', async ({ thankYouPage, pageObjects }) => {
    await thankYouPage.waitForLoadState('networkidle');
    
    const thankYouPageObj = pageObjects.thankYouPage;
    await thankYouPageObj.waitForMessageReady();
    
    const content = await thankYouPageObj.affirmativemessage.textContent();
    const stringmessages = messages.map((msg: { en: string }) => msg.en);
    expect(stringmessages).toContain(content);
  });

  test('Thank you page actions work correctly', async ({ pageObjects, homePage }) => {
    await test.step('User can reset and try again', async () => {
      const thankYouPage = pageObjects.thankYouPage;
      await thankYouPage.goto();
      await thankYouPage.clickTryAgain();
      await expect(homePage).toHaveURL(/.*/);
    });

    await test.step('User can navigate to help page', async () => {
      const thankYouPage = pageObjects.thankYouPage;
      await thankYouPage.goto();
      const helpLink = thankYouPage.getGetHelpLink();
      await expect(helpLink).toHaveAttribute('href', 'https://www.thetrevorproject.org/get-help');
      await expect(helpLink).toHaveAttribute('target', '_blank');
      await expect(helpLink).toHaveAttribute('rel', 'noopener');
    });

    await test.step('User can navigate to donate page', async () => {
      const thankYouPage = pageObjects.thankYouPage;
      await thankYouPage.goto();
      const donateLink = thankYouPage.getDonateLink();
      await expect(donateLink).toHaveAttribute('href', 'https://give.thetrevorproject.org/campaign/716635/donate');
      await expect(donateLink).toHaveAttribute('target', '_blank');
      await expect(donateLink).toHaveAttribute('rel', 'noopener');
    });
  });
});

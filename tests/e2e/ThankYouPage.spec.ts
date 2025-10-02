import { expect, test } from '@playwright/test';
import { ThankYouPage } from "../page-objects";
import messages from '../../src/assets/messages.json' with { type: 'json' };

test.describe.skip('Thank You Page', ()=>{
    let thankyoupage: ThankYouPage;

    test.beforeEach(async ({page})=> {
        thankyoupage=new ThankYouPage(page);
        await thankyoupage.goto();
    });

    test.describe('Affirmation Message', ()=>{
        test('should display an affirmative message on the thank you page', async ({page})=> {
            const content = await thankyoupage.affirmativemessage.textContent();
            const stringmessages=messages.map(msg => msg['en']);
            expect(stringmessages).toContain(content);
        });

    });

    test.describe('Thank you page buttons', ()=>{
     test('should reset when clicked', async ({ page }) => {
        await thankyoupage.goto()
        await page.getByText('Try again').click()
        await expect(page).toHaveURL(/.*/);
     });
     test('should open Trevors help page when clicked', async ({ page }) => {
        await thankyoupage.goto()
        await page.getByText('Get help').click()
        await expect(page).toHaveURL('https://www.thetrevorproject.org/get-help/');
     });
     test('should go to donate page when clicked', async ({ page }) => {
        await thankyoupage.goto()
        await page.getByText('Donate').click()
        await expect(page).toHaveURL('https://give.thetrevorproject.org/campaign/716635/donate');

     });
    });     

});

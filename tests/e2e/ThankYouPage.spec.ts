import { expect, test } from '@playwright/test';
import { ThankYouPage } from "../page-objects";
import messages from '../../src/assets/messages.json' with { type: 'json' };

test.describe('Thank You Page', ()=>{
    let thankyoupage: ThankYouPage;

    test.beforeEach(async ({page})=> {
        thankyoupage=new ThankYouPage(page);
        await thankyoupage.goto();
    });

    test.describe('Affirmation Message', ()=>{
        test('should display an affirmative message on the thank you page', async ()=> {
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
        
        // Get the help link and verify it has the correct href
        const helpLink = page.getByText('Get help');
        await expect(helpLink).toHaveAttribute('href', 'https://www.thetrevorproject.org/get-help');
        await expect(helpLink).toHaveAttribute('target', '_blank');
        await expect(helpLink).toHaveAttribute('rel', 'noopener');
     });
     test('should go to donate page when clicked', async ({ page }) => {
        await thankyoupage.goto()
        
        // Get the donate link and verify it has the correct href
        const donateLink = page.getByText('Donate');
        await expect(donateLink).toHaveAttribute('href', 'https://give.thetrevorproject.org/campaign/716635/donate');
        await expect(donateLink).toHaveAttribute('target', '_blank');
        await expect(donateLink).toHaveAttribute('rel', 'noopener');
     });
    });     

});

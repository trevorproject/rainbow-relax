import { expect, test } from '@playwright/test';
import { ThankYouPage } from "../page-objects";

test.describe('Thank You Page', ()=>{
    let thankyoupage: ThankYouPage;

    test.beforeEach(async ({page})=> {
        thankyoupage=new ThankYouPage(page);
        await thankyoupage.goto();
    });

    test.describe('Anonymous feedback', ()=>{

        test('should display feedback options when clicking yes', async ({ page })=> {
            await page.evaluate(() => {
                localStorage.removeItem('survey_completed');
                localStorage.removeItem('survey_completion_date');
            });
            // Set cookie consent programmatically since we've already navigated past the banner
            await page.evaluate(() => {
                document.cookie = 'cookie1=true; path=/; max-age=31536000';
            });
            await page.reload();
            await page.waitForSelector('[data-testid="survey-inline"]', { timeout: 10000 });
            const yesButton = page.getByRole('button').filter({ hasText: 'Yes' });
            const noButton = page.getByRole('button').filter({ hasText: 'Skip for now' });
            await expect(yesButton).toBeVisible({ timeout: 10000 });
            await expect(noButton).toBeVisible({ timeout: 10000 });
            await page.getByText('Yes').click()
            const sameButton = page.getByRole('button').filter({ hasText: 'I feel the same' });
            const bitButton = page.getByRole('button').filter({ hasText: 'A bit better' });
            const moreButton = page.getByRole('button').filter({ hasText: 'More relaxed' });
            const muchButton = page.getByRole('button').filter({ hasText: 'Much calmer' });
            await expect(sameButton).toBeVisible();
            await expect(bitButton).toBeVisible();
            await expect(moreButton).toBeVisible();
            await expect(muchButton).toBeVisible();
        });
        test('should display feedback options when clicking skip for now', async ({ page })=> {
            await page.evaluate(() => {
                localStorage.removeItem('survey_completed');
                localStorage.removeItem('survey_completion_date');
            });
            // Set cookie consent programmatically since we've already navigated past the banner
            await page.evaluate(() => {
                document.cookie = 'cookie1=true; path=/; max-age=31536000';
            });
            await page.reload();  
            await page.waitForSelector('[data-testid="survey-inline"]', { timeout: 10000 });
            const skipForNowButton = page.getByText('Skip for now');
            await expect(skipForNowButton).toBeVisible({ timeout: 10000 });
            await skipForNowButton.click();
            await expect(skipForNowButton).toBeHidden();
        });
        [{  button:'Much calmer',
            result: 'Thank you for your feedback!'
        },
        {   button:'A bit better',
            result:'Thank you for your feedback!'
        },
        {   button:'More relaxed',
            result:'Thank you for your feedback!'
        },
        {   button:'I feel the same',
            result:'Thanks for sharing how you feel'
        }].forEach((testCase)=>{
            test('should save GA data for button ' + testCase.button , async ({ page })=> {
                await page.evaluate(() => {
                    localStorage.removeItem('survey_completed');
                    localStorage.removeItem('survey_completion_date');
                });
                // Set cookie consent programmatically since we've already navigated past the banner
                await page.evaluate(() => {
                    document.cookie = 'cookie1=true; path=/; max-age=31536000';
                });
                await page.reload();  
                await page.waitForSelector('[data-testid="survey-inline"]', { timeout: 10000 });
                const yesButton = page.getByRole('button').filter({ hasText: 'Yes' });
                await expect(yesButton).toBeVisible({ timeout: 10000 });
                await yesButton.click();
                const muchButton = page.getByRole('button').filter({ hasText: testCase.button });
                await muchButton.click();
                await expect(page.getByText(testCase.result)).toBeVisible();
                const internalData=await page.evaluate(()=>{
                    return localStorage.getItem('survey_completion_date');
                });
                expect(internalData).toBeTruthy();
            });
        })
        
    });
});

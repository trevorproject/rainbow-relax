import { expect, test } from '@playwright/test';
import { ThankYouPage } from "../page-objects";
import { acceptCookieIfExist } from '../fixtures/testHelpers';
import messages from '../../src/assets/messages.json' with { type: 'json' };

test.describe('Thank You Page', ()=>{
    let thankyoupage: ThankYouPage;

    test.beforeEach(async ({page})=> {
        thankyoupage=new ThankYouPage(page);
        await thankyoupage.goto();
    });

    test.describe('Anonymous feedback', ()=>{

        test('should display feedback options when clicking yes', async ({ page })=> {
            await acceptCookieIfExist(page);
            await page.reload();
            const YesButton = page.getByRole('button').filter({ hasText: 'Yes' });
            const NoButton = page.getByRole('button').filter({ hasText: 'Skip for now' });
            await expect(YesButton).toBeVisible();
            await expect(NoButton).toBeVisible();
            await page.getByText('Yes').click()
            const SameButton = page.getByRole('button').filter({ hasText: 'I feel the same' });
            const BitButton = page.getByRole('button').filter({ hasText: 'A bit better' });
            const MoreButton = page.getByRole('button').filter({ hasText: 'More relaxed' });
            const MuchButton = page.getByRole('button').filter({ hasText: 'Much calmer' });
            await expect(SameButton).toBeVisible();
            await expect(BitButton).toBeVisible();
            await expect(MoreButton).toBeVisible();
            await expect(MuchButton).toBeVisible();
        });
        test('should display feedback options when clicking skip for now', async ({ page })=> {
            await acceptCookieIfExist(page);
            await page.reload();  
            const skipForNow =page.getByText('Skip for now');
            await skipForNow.click();
            await expect(skipForNow).toBeHidden();
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
                await acceptCookieIfExist(page);
                await page.reload();  
                const YesButton = page.getByRole('button').filter({ hasText: 'Yes' });
                await YesButton.click();
                const MuchButton = page.getByRole('button').filter({ hasText: testCase.button });
                await MuchButton.click();
                await expect(page.getByText(testCase.result)).toBeVisible();
                const internalData=await page.evaluate(()=>{
                    return localStorage.getItem('survey_completion_date')
                })
                console.log('data', internalData);
                expect(internalData).toBeTruthy();
            });
        })
        
    });

    test.describe('Annonymous feedback feeling great', ()=>{
        test('should display message when clicking feeling great', async ({ page })=> {

        });
    });
        test.describe('Annonymous feedback feeling better', ()=>{
        test('should display message when clicking feeling better', async ({ page })=> {

        });
    });
        test.describe('Annonymous feedback feeling same', ()=>{
        test('should display message when clicking feeling same', async ({ page })=> {

        });
    });
        test.describe('Annonymous feedback feeling didnt help', ()=>{
        test('should display message when clicking feeling didnt help', async ({ page })=> {

        });
    });
});
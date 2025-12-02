import { expect, test } from '@playwright/test';
import { ThankYouPage } from "../page-objects";
import messages from '../../src/assets/messages.json' with { type: 'json' };

test.describe('Thank You Page', ()=>{
    let thankyoupage: ThankYouPage;

    test.beforeEach(async ({page})=> {
        thankyoupage=new ThankYouPage(page);
        await thankyoupage.goto();
    });
        test.describe('Check time', ()=>{
        test('should test only if seven days have passed', async ({ page })=> {

        });
    });
    test.describe('Survey appears', ()=>{
        test('should display survey on thankyou page', async ({ page })=> {
            await thankyoupage.goto()
            const YesButton = page.getByRole('button').filter({ hasText: 'Yes' });
            const NoButton = page.getByRole('button').filter({ hasText: 'Skip for now' });
            await expect(YesButton).toBeVisible();
            await expect(NoButton).toBeVisible();
        });
    });
    test.describe('Anonymous feedback yes', ()=>{
        test('should display feedback options when clicking yes', async ({ page })=> {
            await thankyoupage.goto()
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

    });

        test.describe('Annonymous feedback no', ()=>{
        test('should display feedback options when clicking no', async ({ page })=> {

        });
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
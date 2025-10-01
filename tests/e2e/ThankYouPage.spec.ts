import { expect, test } from '@playwright/test';
import TestData from '../fixtures/testData';
import { ThankYouPage } from "../page-objects";
import { navigateToWidget, WidgetSelectors } from '../fixtures/testHelpers';
import { setupWidgetTests } from '../setup/widget-validation';
import messages from '../../src/assets/messages.json' with { type: 'json' };

test.describe('Thank You Page', ()=>{
    let thankyoupage: ThankYouPage;

    setupWidgetTests();

    test.beforeEach(async ({page})=> {
        thankyoupage=new ThankYouPage(page);
        await navigateToWidget(page);
        // Navigate to thank you page using 0-minute custom input
        await page.locator(WidgetSelectors.customTimeButton).click();
        await page.locator(WidgetSelectors.customTimeInput).fill('0');
        await page.locator(WidgetSelectors.customStartButton).click();
        // 0-minute exercise should complete immediately
        await page.waitForTimeout(1000); // Brief wait for navigation
    });

    test.describe('Widget Functionality', ()=>{
        test('should load widget successfully', async ({page})=> {
            await expect(page.locator(WidgetSelectors.widgetContainer)).toBeVisible();
        });
    });

    test.describe('Affirmation Message', ()=>{
        test('should display an affirmative message on the thank you page', async ({page})=> {
            // Wait for thank you page to be visible
            await page.waitForSelector('[data-testid="thank-you-page"]', { timeout: 10000 });
            const content = await thankyoupage.affirmativemessage.textContent();
            const stringmessages=messages.map(msg => msg['en']);
            expect(stringmessages).toContain(content);
        });
    });

    test.describe('Thank you page buttons', ()=>{
        test('should reset when clicked', async ({ page }) => {
            await page.waitForSelector('[data-testid="thank-you-page"]', { timeout: 10000 });
            await page.getByText('Try again').click();
            await expect(page.locator(WidgetSelectors.widgetContainer)).toBeVisible();
        });
        
        test('should open Trevors help page when clicked', async ({ page }) => {
            await page.waitForSelector('[data-testid="thank-you-page"]', { timeout: 10000 });
            const [newPage] = await Promise.all([
                page.waitForEvent('popup'),
                page.getByText('Get help').click()
            ]);
            await newPage.waitForLoadState();
            await expect(newPage).toHaveURL('https://www.thetrevorproject.org/get-help/');
        });
        
        test('should go to donate page when clicked', async ({ page }) => {
            await page.waitForSelector('[data-testid="thank-you-page"]', { timeout: 10000 });
            const [newPage] = await Promise.all([
                page.waitForEvent('popup'),
                page.getByText('Donate').click()
            ]);
            await newPage.waitForLoadState();
            await expect(newPage).toHaveURL('https://give.thetrevorproject.org/campaign/716635/donate');
        });
    });     
});

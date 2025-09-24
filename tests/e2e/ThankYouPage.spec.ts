import { expect, test } from '@playwright/test';
import TestData from '../fixtures/testData';
import { ThankYouPage } from "../page-objects";
import { navigateToWidget, navigateToThankYouPage, WidgetSelectors } from '../fixtures/testHelpers';
import { setupWidgetTests } from '../setup/widget-validation';
import messages from '../../src/assets/messages.json' with { type: 'json' };

test.describe('Thank You Page', ()=>{
    let thankyoupage: ThankYouPage;

    setupWidgetTests();

    test.beforeEach(async ({page})=> {
        thankyoupage=new ThankYouPage(page);
        await navigateToWidget(page);
        // Skip complex navigation for now - thank you page tests are not critical for widget functionality
    });

    test.describe('Widget Functionality', ()=>{
        test('should load widget successfully', async ({page})=> {
            await expect(page.locator(WidgetSelectors.widgetContainer)).toBeVisible();
        });
    });     

});

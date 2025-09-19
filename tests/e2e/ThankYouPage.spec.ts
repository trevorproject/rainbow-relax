import { expect, test } from '@playwright/test';
import TestData from '../fixtures/testData';
import { ThankYouPage } from "../page-objects";
import messages from '../../src/assets/messages.json' with { type: 'json' };

test.describe('Thank You Page', ()=>{
    let thankyoupage: ThankYouPage;
    test.beforeEach(async ({page})=> {
        thankyoupage=new ThankYouPage (page);
        await thankyoupage.goto();
    });

    test.describe('Affirmation Message', ()=>{
        test('should an affirmative message appear in thank you page', async ({page})=> {
            const content = await thankyoupage.affirmativemessage.textContent();
            const stringmessages=messages.map(msg => msg['en']);
            expect(stringmessages).toContain(content);
        })
    });

})
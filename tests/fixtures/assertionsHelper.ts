import {expect, Page} from '@playwright/test';

export async function expectUiLanguage (page: Page, lang: 'EN' | 'ES'){
    //Toggle by language
    const toggle = page.getByRole('button', { name: lang === 'EN' ? /^En$/i : /^Es$/i });
    await expect(toggle).toBeVisible();
    
    // Donation link and text
    const donateName = lang === 'EN' ? /^Donate$/i : /^Donar$/i;
    await expect(page.getByRole('link', { name: donateName })).toBeVisible();

    // Logo by language
    const logo = page.getByAltText('LogoAlt');
    const suffix = lang.toLowerCase(); // 'en' | 'es'
    await expect(logo).toHaveAttribute('src', new RegExp(`TrevorLogo-${suffix}(-[A-Za-z0-9]+)?\\.svg(\\?.*)?$`, 'i'));
}
const puppeteer = require('puppeteer');

describe('example', () => {
    /** @type {puppeteer.Browser} */
    let browser;
    /** @type {puppeteer.Page} */
    let page;
    beforeEach(async () => {
        browser = await puppeteer.launch(
            {
                slowMo: 300,
                headless: false,
                args: [
                    '--no-sandbox',
                ]
            }
        );
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
        await browser.close();
    });

    it('should be titled "Example Domain"', async () => {
        await page.goto('https://example.com');
        await expect(page.title()).resolves.toMatch('Example Domain');
    });
});

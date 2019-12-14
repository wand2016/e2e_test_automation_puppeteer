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

    test('JS,Cookieともに有効ならばindex.htmlを表示する', async () => {
        await page.goto('http://localhost:8080/index.html');
        await expect(page.title()).resolves.toMatch('index.html');
    });
});

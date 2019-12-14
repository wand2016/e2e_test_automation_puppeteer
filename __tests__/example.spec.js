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
        await page.goto('http://localhost:8080/index.html', { timeout: 1000, waitUntil: 'domcontentloaded' });
        await expect(page.title()).resolves.toMatch('index.html');
    });

    test('JS無効だとno-script.htmlにリダイレクト', async () => {
        page.setJavaScriptEnabled(false);
        await page.goto('http://localhost:8080/index.html', { timeout: 1000, waitUntil: 'domcontentloaded' });
        // DOMContentLoaded後、metaタグによるリダイレクト待ち
        await page.waitForNavigation({ timeout: 1000 });

        await expect(page.title()).resolves.toMatch('no-script.html');
    });

    test('Cookie無効だとno-cookie.htmlにリダイレクト', async () => {

        page.evaluateOnNewDocument(() => {
            Object.defineProperty(
                navigator,
                'cookieEnabled',
                { value: false }
            );
        });

        await Promise.all([
            page.goto('http://localhost:8080/index.html', { timeout: 1000, waitUntil: 'domcontentloaded' }),
            // 同期スクリプト実行・遷移待ち
            page.waitForNavigation({ timeout: 1000 })
        ]);

        await expect(page.title()).resolves.toMatch('no-cookie.html');
    });
});

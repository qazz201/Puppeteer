const puppeteer = require('puppeteer');
const func = require('./getFilterLinks');


const account = {
    username: 'user.tre@gmail.com',
    password: 'passs',
};
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
const getRandomDelay = (min, max) => 1000 * (min + Math.random().toFixed(2) * (max - min));



(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
            request.abort();
        } else {
            request.continue();
        }
    });

    await page.goto('https://hh.ru/login', { timeout: 0 });
    const logName = 'body > div.light-page.light-page_promo > div > div.bloko-column.bloko-column_xs-4.bloko-column_s-4.bloko-column_m-4.bloko-column_l-4 > div > div > form > div:nth-child(7) > input';
    const logPass = 'body > div.light-page.light-page_promo > div > div.bloko-column.bloko-column_xs-4.bloko-column_s-4.bloko-column_m-4.bloko-column_l-4 > div > div > form > div:nth-child(8) > input';
    const submitBtn = 'body > div.light-page.light-page_promo > div > div.bloko-column.bloko-column_xs-4.bloko-column_s-4.bloko-column_m-4.bloko-column_l-4 > div > div > form > div.account-form-actions > input';
    await page.waitFor('.bloko-input.HH-AuthForm-Login')
    // await page.$$eval(logName, el => el.value = 'HELLO')
    /* await page.click(logName);
     await page.keyboard.type(account.username);
     await page.click(logPass);
     await page.keyboard.type(account.password);
     await page.click(submitBtn);
  */
    await func.getlinks(browser)


    // await browser.close();
})();
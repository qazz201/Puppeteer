var fs = require('fs');
const func = require('./getCandidateData');

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
const getRandomDelay = (min, max) => 1000 * (min + Math.random().toFixed(2) * (max - min));

const recrFilter = 'https://hh.ru/search/resume?text=JavaScript+or+node+or+js+or+node+js+or+react+or+react+js+or+front-end+or+VUE&logic=normal&pos=full_text&exp_period=all_time&specialization=1.10&specialization=1.9&specialization=1.221&area=16&relocation=living_but_relocation&salary_from=&salary_to=&currency_code=USD&experience=noExperience&experience=between1And3&experience=between3And6&experience=moreThan6&education=none&age_from=&age_to=&gender=unknown&employment=full&language=eng.c2&order_by=publication_time&search_period=0&items_on_page=3&from=suggest_post'

const getlinks = async (browser) => {
    // const linkSelector = 'body > div.HH-MainContent.HH-Supernova-MainContent > div > div > div.bloko-columns-wrapper > div > div > div.bloko-gap.bloko-gap_top > div > div > div.bloko-column.bloko-column_l-13.bloko-column_m-9 > div:nth-child(3) > div:nth-child(4) > div:nth-child(2) > div.resume-search-item__content-wrapper > div.resume-search-item__content-layout > div.resume-search-item__content > div.resume-search-item__header > a'

    let page = await browser.newPage();
    await preventScriptsLoading(page)
    await page.goto(recrFilter, { timeout: 0 });
    let { resumes,
        pages, } = await getResumAndPages(page)

    console.log(pages)
    /* let nextPage = await page.$(`a[href="${pages[0]}"]`)
     await nextPage.click()*/
    //let clickOnPage = await page.$$('a[data-qa="pager-page"]')

    //let resumes = await page.$$('a[itemprop="jobTitle"');

    /* await page.goto(resumes[0], { timeout: 0 })
     let bodyHTML = await page.evaluate(() => document.body.innerHTML)
     let dataToSave = await func.getRecruitDataFromHTML(bodyHTML);
 
 */
    var candidates = {
        data: []
    };

    /*let currentPage = 0;
    let lastPage = pages.slice(-1)[0];*/

    for (currentPage of pages) {
        console.log(/*currentPage,*/ '----', pages.length)
        for (resume of resumes) {
            // currentPage++;

            //await preventScriptsLoading(page);
            await timeout(getRandomDelay(4, 8))
            await page.goto(resume, { timeout: 0 })
            let bodyHTML = await page.evaluate(() => document.body.innerHTML)
            let dataToSave = await func.getRecruitDataFromHTML(bodyHTML, resume);
            console.log(dataToSave)
            candidates.data.push(dataToSave)
            //var json = JSON.stringify(candidates);
            // fs.writeFile('myjsonfile.json', json, 'utf8', () => console.log('SAVED'));

            await page.evaluate(() => {
                let randomScroll = setInterval(() => { window.scrollBy(0, Math.random() * 45) }, 250)
                setTimeout(() => clearInterval(randomScroll), 24000)
            })
            let randomTime = getRandomDelay(25, 36)
            await timeout(randomTime)
            console.log('Random DELAY =', randomTime)
            //await page.close()
            await page.goBack()
            // page.removeAllListeners('request');
        }


        var json = JSON.stringify(candidates);
        fs.writeFile('myjsonfile.json', json, 'utf8', () => console.log('SAVED'));

        let nextPage = await page.$(`a[href="${currentPage}"]`)
        await nextPage.click();
        await page.waitForNavigation({ timeout: 0, waitUntil: ['domcontentloaded'] })
        let newResumes = await getResumAndPages(page);
        resumes = newResumes.resumes;
        //resumes = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop="jobTitle"'), element => element.href));

        console.log('Reeee', resumes)
        /* await page.close()
         await page.removeAllListeners('request');
         page = await browser.newPage();
         await page.goto(currentPage, { timeout: 0 })*/

    }
}


const getResumAndPages = async (page) => {
    const resumes = await page.evaluate(() => Array.from(document.querySelectorAll('a[itemprop="jobTitle"'), element => element.href));
    const pages = await page.evaluate(() => Array.from(document.querySelectorAll('a[data-qa="pager-page"]'), el => `${el.pathname}${el.search}`));
    pages.push('nul')
    return {
        resumes,
        pages,
    }
}



const preventScriptsLoading = async (page) => {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', '', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
            request.abort();
        } else {
            request.continue();
        }
    });
}

module.exports.getlinks = getlinks;
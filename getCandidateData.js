const cheerio = require('cheerio');
const _ = require('lodash');

const getRecruitDataFromHTML = async (body, resumeLink) => {


    const mainBlock = '.resume-header .resume-header-main';

    const $ = cheerio.load(body);

    // if (!$(mainBlock).length) {
    //   const err = new Error('VIEW_LIMIT_EXCEEDED');
    //   err.currentAccEmail = this.email;
    //   throw err;
    // }

    const name = $('.resume-header-name > h1', mainBlock).text().trim();
    const [first_name, last_name] = name.split(' ');
    const source = resumeLink.replace(/(.*)?\?.*/gi, '$1').replace(/https:\/\/hh\.ru\//gi, 'https://spb.hh.ru/')
    console.log(source)
    const address = $('.resume-header .resume-header-block', mainBlock).text().trim();
    const mobile = $('.resume-header-main div[data-qa="resume-contacts-phone"] > span').text().trim();
    const email = $('.resume-header-main a[itemprop="email"]').text().trim();
    const skype = $('.resume-header-main .resume-header-contact .siteicon_skype').text().trim();
    const website = $('.resume-header-main .resume-header-contact .siteicon_personal').text().trim();
    const position = $('.header_level-2 [data-qa="resume-block-title-position"]').text().trim();
    const salaryString = _.toString($('.resume-block-container [data-qa="resume-block-salary"]').text()).trim();
    let expected_salary = salaryString.replace(/[^\d]/gi, '');
    const currency = salaryString.replace(/[^A-Za-zА-Яа-я]*/gi, '');

    if (_.isEmpty(expected_salary)) {
        expected_salary = 0;
    }
    /* eslint func-names: ["error", "never"] */

    let employment = '';
    $('[data-qa="resume-block-experience"] .bloko-link_list').each(function () {
        employment = $(this).text().trim();
        return false;
    });

    let education = '';
    $('[data-qa="resume-block-education-name"]:first-child').each(function () {
        education = $(this).text().trim();
        return false;
    });

    let specialty = '';
    $('[data-qa="resume-block-education-organization"]').each(function () {
        specialty = $(this).text().trim();
        return false;
    });

    let english_level;
    $('[data-qa="resume-block-language-item"]').each(function () {
        const text = $(this).text().trim();
        if (text.match(/Английский|English|Англійська/gi)) {
            english_level = text.replace(/(?:Английский|English|Англійська)\s*—\s*(\w{2,6})(?:.*)/gi, '$1'); // previouse: (?:Английский|English)\s*—\s*(.*)$
        }
    });
    const english = english_level ? english_level.toLowerCase() : '';

    const mapEnglishLevel = (langLevelString) => {
        // console.log(langLevelString)
        switch (true) {
            case langLevelString === 'a1' || langLevelString === 'начинающий':
                return 'A1';
            case langLevelString === 'a2':
                return 'A2';
            case langLevelString === 'b1' || langLevelString === 'средний':
                return 'B1';
            case langLevelString === 'b2' || langLevelString === 'выше среднего':
                return 'B2';
            case langLevelString === 'c1' || langLevelString === 'продвинутый':
                return 'C1';
            case langLevelString === 'c2' || langLevelString === 'свободно' || langLevelString.includes('родной') || langLevelString.includes('native'):
                return 'C2';
            default:
                return 'A1';
        }
    }

    english_level = mapEnglishLevel(english);


    return {
        priority: 2,
        role: 'JavaScript Developer (Junior — Senior)',
        first_name,
        last_name,
        source,
        address,
        mobile,
        email,
        skype,
        website,
        position,
        expected_salary,
        english_level,
        specialty,
        employment,
        education,
        currency,
    };
}
module.exports.getRecruitDataFromHTML = getRecruitDataFromHTML;

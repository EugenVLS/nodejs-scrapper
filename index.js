import cherio from 'cherio';
import chalk from 'chalk';
import { slugify } from 'transliteration';
import listItemsHandler from './handlers/listItemsHandler';
import { arrayFromLength } from './helpers/common';
import { PuppeteerHandler } from './helpers/puppeteer';
import queue from 'async/queue';

const BASE_URL = 'https://zakupki.gov.ru';
const SITE = 'https://zakupki.gov.ru/epz/eruz/search/results.html?pageNumber=';
const pages = 100;
const concurrency = 10;
const startTime = new Date();

export const p = new PuppeteerHandler();
export const taskQueue = queue(async (task, done) => {
  try {
    await task();
    console.log(chalk.bold.magenta('Task completed, tasks left: ' + taskQueue.length() + '\n'));
    done();
  } catch (err) {
    throw err;
  }
}, concurrency);

taskQueue.drain(function() {
  const endTime = new Date();
  console.log(chalk.green.bold(`🎉  All items completed [${(endTime - startTime) / 1000}s]\n`));
  p.closeBrowser();
  process.exit();
});

(function main() {
  arrayFromLength(pages).forEach(page => {
    taskQueue.push(
      () => listPageHandle(`${SITE}${page}`),
      err => {
        if (err) {
          console.log(err);
          throw new Error('🚫 Error getting data from page#' + page);
        }
        console.log(chalk.green.bold(`Completed getting data from page#${page}\n`));
      }
    );
  });
})();

async function listPageHandle(url) {
  try {
    const pageContent = await p.getPageContent(url);
    const $ = cherio.load(pageContent);
    const contactItems = [];

    $('.registry-entry__body-href a').each((i, header) => {
      const url = BASE_URL + $(header).attr('href');
      const title = $(header).text();

      contactItems.push({
        url,
        code: slugify(title)
      });
    });
    listItemsHandler(contactItems);
  } catch (err) {
    console.log(chalk.red('An error has occured \n'));
    console.log(err);
  }
}

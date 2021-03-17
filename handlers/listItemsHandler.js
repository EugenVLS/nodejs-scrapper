import cherio from 'cherio';
import chalk from 'chalk';

import saveData from './saver';
import { formatPrice, formatPeriod } from '../helpers/common';
import { taskQueue, p } from '../index';

const task = async initialData => {
  try {
    console.log(chalk.green(`Getting data from: `) + chalk.green.bold(initialData.url));
    const detailContent = await p.getPageContent(initialData.url);
    const $ = cherio.load(detailContent);
    let data = $('.wrapper')
        .text()
        .split(/\r\n|\r|\n/g)
        .map(item => item.trim())
        .filter(item => !!item);

    let name = '';
    let phone = '';
    let email = '';

    data.forEach((item,index) => {
        if (item.toLowerCase() == 'ФИО'.toLowerCase()) {
            name = data[index + 1];
        }
        if (item.toLowerCase() == 'ДОЛЖНОСТЬ'.toLowerCase()) {
            name = data[index + 2];
        }
        if (item.toLowerCase() == 'Адрес электронной почты'.toLowerCase()) {
            email = data[index + 1];
        }
        if (item.toLowerCase() == 'Контактный телефон'.toLowerCase()) {
            phone = data[index + 1];
        }
    })

    await saveData({
      name,
      phone,
      email,
    });
  } catch (err) {
    throw err;
  }
};
export default function listItemsHandler(data) {
  data.forEach(initialData => {
    taskQueue.push(
      () => task(initialData),
      err => {
        if (err) {
          console.log(err);
          throw new Error('Error getting data from url[ ' + initialData.url + ' ]');
        }
        console.log(chalk.green.bold(`Success getting data from: \n${initialData.url}\n`));
      }
    );
  });
}

import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

export default async function saveData(data) {
  const fileName = 'data.txt';
  const savePath = path.join(__dirname, '..', 'data', fileName);

  return new Promise((resolve, reject) => {
    fs.appendFileSync(savePath, `\n${data.name}/${data.phone}/${data.email}`, err => {
      if (err) {
        return reject(err);
      }

      console.log(chalk.blue('File was saved successfully: ') + chalk.blue.bold(fileName) + '\n');

      resolve();
    });
  });
}

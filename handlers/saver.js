import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

export default async function saveData(data) {
  const { code } = data;
  const fileName = `${code}.txt`;
  const savePath = path.join(__dirname, '..', 'data', fileName);

  return new Promise((resolve, reject) => {
    fs.writeFile(savePath, `${data.name}/${data.phone}/${data.email}\n`, err => {
      if (err) {
        return reject(err);
      }

      console.log(chalk.blue('File was saved successfully: ') + chalk.blue.bold(fileName) + '\n');

      resolve();
    });
  });
}

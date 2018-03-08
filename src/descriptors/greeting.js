require(`colors`);
const pkg = require(`../../package.json`);
const readline = require(`readline`);
const {promisify} = require(`util`);
const path = require(`path`);
const fs = require(`fs`);

const {generateEntity} = require(`../utils/generateEntity`);

const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const YSE_ANSWERS = [`y`, `yes`];

const requestDataFromUser = (query) => new Promise((resolve) => rl.question(query, resolve));

const suggestUserToGenerateData = () => requestDataFromUser(`Хотите сгенерировать тестовых данных?\n`)
    .then((rawAnswer) => {
      const answer = rawAnswer.toLowerCase().trim();

      if (YSE_ANSWERS.indexOf(answer) > -1) {
        return {isWantToGenerate: true};
      } else {
        console.log(`Ответьте "y" или "yes"`);
        return suggestUserToGenerateData();
      }
    });


const requestAmount = (collectedData) => requestDataFromUser(`Сколько сущностей будем генерировать?\n`)
    .then((rawAmount) => {
      const amount = parseInt(rawAmount, 10);

      if (isNaN(amount)) {
        console.log(`"${rawAmount}" — не число. Введите число.`);
        return requestAmount(collectedData);
      } else {
        return Object.assign({}, collectedData, {amount});
      }
    });

const requestConfirmationRewrite = (collectedData) =>
  requestDataFromUser(`"${collectedData.fileName}" уже существует. Перезаписать?\n`)
      .then((rawAnswer) => {
        const answer = rawAnswer.toLowerCase().trim();

        if (YSE_ANSWERS.indexOf(answer) > -1) {
          return collectedData;
        } else {
          throw new Error(`Файл "${collectedData.fileName}" уже существует. Попробуйте еще раз.`);
        }
      });


const requestFileName = (collectedData) =>
  requestDataFromUser(`Куда сохранить сгенерированные данные? (введите имя файла)\n`)
      .then((rawAnswer) => {
        const fileName = rawAnswer.toLowerCase().trim();
        const filePath = path.join(process.cwd(), fileName);
        return Promise.all([filePath, fileName, exists(filePath)]);
      })
      .then(([filePath, fileName, isExists]) => {
        const nextData = Object.assign({}, collectedData, {
          path: filePath,
          fileName
        });

        if (!isExists) {
          return nextData;
        } else {
          return requestConfirmationRewrite(nextData);
        }
      });

const generateMockData = (collectedData) => {
  const data = Array.from(Array(collectedData.amount).keys()).map(() => {
    return generateEntity();
  });

  return exists(collectedData.path)
      .then((isExists) => isExists && unlink(collectedData.path))
      .then(() => writeFile(collectedData.path, JSON.stringify(data)))
      .then(() => {
        console.log(`"${collectedData.fileName}" сохранен`);
      });
};

function emptyHandler() {
  console.log(
      `Привет пользователь! Эта программа будет запускать сервер «${pkg.name.bold}». Автор: ${pkg.author.underline}.`
  );

  return suggestUserToGenerateData()
      .then(requestAmount)
      .then(requestFileName)
      .then(generateMockData)
      .then(() => rl.close())
      .catch((err) => {
        console.error(err.message);
        process.exit();
      });
}

module.exports = {
  aliases: [undefined], // eslint-disable-line no-undefined
  execute: emptyHandler,
};

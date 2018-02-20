require(`colors`);
const pkg = require(`../../package.json`);
const readline = require(`readline`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const requestDataFromUser = (query) => new Promise((resolve) => rl.question(query, resolve));

const yesAnswers = [`y`, `yes`];

function emptyHandler() {
  console.log(
      `Привет пользователь! Эта программа будет запускать сервер «${pkg.name.bold}». Автор: ${pkg.author.underline}.`
  );

  requestDataFromUser(`Хотите сгенерировать тестовых данных?\n`)
      .then((rawAnswer) => {
        const answer = rawAnswer.toLowerCase().trim();
        if (yesAnswers.indexOf(answer) > -1) {
          return requestDataFromUser(`Сколько сущностей будем генерировать?\n`);
        } else {
          return Promise.reject(new Error(`Получен неожиданный ответ.`));
        }
      })
      .then((rawAmount) => {
        const amount = parseInt(rawAmount, 10);
        if (isNaN(amount)) {
          return Promise.reject(new Error(`Количество должно быть числом.`));
        } else {
          return amount;
        }
      })
      .then(() => rl.close())
      .catch((err) => {
        console.error(err.message);
        console.error(`Программа завершила работу. Попробуйте еще раз.`);
        process.exit(1);
      });
}

module.exports = {
  aliases: [undefined], // eslint-disable-line no-undefined
  execute: emptyHandler,
};

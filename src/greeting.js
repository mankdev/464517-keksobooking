require(`colors`);
const pkg = require(`../package.json`);

function emptyHandler() {
  console.log(`Привет пользователь! Эта программа будет запускать сервер «${pkg.name.bold}». Автор: ${pkg.author.underline}.`);
}

module.exports = {
  aliases: [undefined], // eslint-disable-line no-undefined
  execute: emptyHandler,
};

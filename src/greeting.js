const pkg = require(`../package.json`);

function emptyHandler() {
  console.log(`Привет пользователь! Эта программа будет запускать сервер «${pkg.name}». Автор: ${pkg.author}.`);
}

module.exports = {
  aliases: [undefined], // eslint-disable-line no-undefined
  execute: emptyHandler,
};

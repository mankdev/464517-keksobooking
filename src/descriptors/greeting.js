require(`colors`);
const pkg = require(`../../package.json`);
const helpDescriptor = require(`./help`);

const emptyHandler = (descriptors) => {
  console.log(
      `Привет пользователь! Эта программа будет запускать сервер «${pkg.name.bold}». Автор: ${pkg.author.underline}.`
  );

  helpDescriptor.execute(descriptors);
};

module.exports = {
  execute: emptyHandler,
};

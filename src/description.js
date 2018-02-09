const pkg = require(`../package.json`);

function descriptionHandler() {
  console.log(pkg.description);
}

module.exports = {
  aliases: [`--description`, `-d`],
  description: `печатает описание приложения`,
  execute: descriptionHandler,
};

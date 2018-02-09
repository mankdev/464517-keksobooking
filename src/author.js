const colors = require(`colors`);
const pkg = require(`../package.json`);

function authorHandler() {
  console.log(colors.underline(pkg.author));
}

module.exports = {
  aliases: [`--author`, `-a`],
  description: `печатает автора приложения`,
  execute: authorHandler,
};

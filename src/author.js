const pkg = require(`../package.json`);

function authorHandler() {
  console.log(pkg.author);
}

module.exports = {
  aliases: [`--author`, `-a`],
  description: `печатает автора приложения`,
  execute: authorHandler,
};

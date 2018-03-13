const colors = require(`colors`);
const pkg = require(`../../package.json`);

const authorHandler = () => {
  console.log(colors.underline(pkg.author));
  process.exit(0);
};

module.exports = {
  aliases: [`--author`, `-a`],
  description: `печатает автора приложения`,
  execute: authorHandler,
};

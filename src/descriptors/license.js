const colors = require(`colors`);
const pkg = require(`../../package.json`);

function licenseHandler() {
  console.log(colors.rainbow(pkg.license));
}

module.exports = {
  aliases: [`--license`, `-l`],
  description: `печатает лицензию приложения`,
  execute: licenseHandler,
};

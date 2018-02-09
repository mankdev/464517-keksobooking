const pkg = require(`../package.json`);

function licenseHandler() {
  console.log(pkg.license);
}

module.exports = {
  aliases: [`--license`, `-l`],
  description: `печатает лицензию приложения`,
  execute: licenseHandler,
};

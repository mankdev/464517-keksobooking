const pkg = require(`../package.json`);

function versionHandler() {
  console.log(`v${pkg.version}`);
}

module.exports = {
  aliases: [`--version`, `-v`],
  description: `печатает версию приложения`,
  execute: versionHandler,
};

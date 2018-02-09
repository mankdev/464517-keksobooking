require(`colors`);
const pkg = require(`../package.json`);

function versionHandler() {
  const [major, minor, patch] = pkg.version.split(`.`);
  console.log(`v${major.red}.${minor.green}.${patch.blue}`);
}

module.exports = {
  aliases: [`--version`, `-v`],
  description: `печатает версию приложения`,
  execute: versionHandler,
};

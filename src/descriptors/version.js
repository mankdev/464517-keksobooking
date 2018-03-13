require(`colors`);
const pkg = require(`../../package.json`);

const versionHandler = () => {
  const [major, minor, patch] = pkg.version.split(`.`);
  console.log(`v${major.red}.${minor.green}.${patch.blue}`);
  process.exit();
};

module.exports = {
  aliases: [`--version`, `-v`],
  description: `печатает версию приложения`,
  execute: versionHandler,
};

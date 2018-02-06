const pkg = require('./package.json');
const [command] = process.argv.slice(2);

const argumentsMap = [
  {
    aliases: ['--version', '-v'],
    description: 'печатает этот текст',
    handler: versionHandler
  },
  {
    aliases: ['--help', '-h'],
    description: 'печатает версию приложения',
    handler: helpHandler
  }
];

function versionHandler() {
  console.log(`v${pkg.version}`);
}

function helpHandler() {
  console.log([
    'Доступные команды:',
    ...argumentsMap.map(arg => `${arg.aliases.join(', ')} — ${arg.description};`)
  ].join('\n'));
}

function emptyHandler() {
  console.log(`Привет пользователь! Эта программа будет запускать сервер «${pkg.name}». Автор: ${pkg.author}.`);
}

function errorHandler() {
  console.log(`Неизвестная команда ${command}. Чтобы прочитать правила использования приложения, наберите "--help"`);
  process.exit(1);
}

if (!command) {
  emptyHandler();
} else {

  const commandDescriptor = argumentsMap.find((cmd => cmd.aliases.indexOf(command.toLowerCase()) > -1));

  if (commandDescriptor) {
    commandDescriptor.handler();
  } else {
    errorHandler();
  }
}



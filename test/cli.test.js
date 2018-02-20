const {fork} = require(`child_process`);
const assert = require(`assert`);

const WAITING_TIMEOUT = 500;

const waitForInactivity = (channel) => {
  return new Promise((resolve) => {
    let timeOut;

    const resetTimeOut = (descriptor) => {
      if (descriptor) {
        clearTimeout(descriptor);
      }
      return setTimeout(resolve, WAITING_TIMEOUT);
    };

    channel.on(`data`, () => {
      timeOut = resetTimeOut(timeOut);
    });
    timeOut = resetTimeOut(timeOut);
  });
};

describe(`[CLI] Usage Without Arguments`, () => {
  let program;
  const messages = [];

  beforeEach(() => {
    program = fork(`./index.js`, {
      stdio: [`pipe`, `pipe`, `pipe`, `ipc`]
    });
    program.stdout.setEncoding(`utf8`);
    program.stderr.setEncoding(`utf8`);

    program.stdout.on(`data`, (data) => {
      messages.push(data.trim());
    });
  });

  afterEach(() => {
    program.kill();
    messages.length = 0;
  });

  it(`should greet user`, () => {
    return waitForInactivity(program).then(() => {
      assert.equal(messages[0], `Привет пользователь! Эта программа будет запускать сервер «keksobooking». Автор: Artem Parkhomenko (mankdev).`)
    });
  });

  it(`should offer user to generate test data`, () => {
    return waitForInactivity(program).then(() => {
      assert.equal(messages[1], `Хотите сгенерировать тестовых данных?`);
    });
  });

  it(`should request amount for data generation`, () => {
    return waitForInactivity(program).then(() => {
      // console.log(program);
      program.stdin.write(`y\n`);

      return waitForInactivity(program);
    }).then(() => {

      console.log(messages);
      assert.equal(messages[2], `Сколько сущностей будем генерировать?`);
    });
  });
});

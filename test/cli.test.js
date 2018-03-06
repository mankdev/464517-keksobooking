const {promisify} = require(`util`);
const fs = require(`fs`);
const assert = require(`assert`);
const {Program} = require(`./utils`);
const path = require(`path`);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);

describe(`[CLI] Usage Without Arguments`, () => {
  let program;

  beforeEach(() => {
    return Program.create()
        .then((prog) => {
          program = prog;
        });
  });

  afterEach(() => {
    program.kill();
    const testFile = path.join(process.cwd(), `test-data.json`);
    return exists(testFile)
        .then((isExists) => isExists && unlink(testFile));
  });

  it(`should greet user`, () => {
    assert.equal(program.messageList[0], `Привет пользователь! Эта программа будет запускать сервер «keksobooking». Автор: Artem Parkhomenko (mankdev).`);
  });

  it(`should offer user to generate test data`, () => {
    return program.waitForLine(`Хотите сгенерировать тестовых данных?`)
        .then(() => {
          assert.equal(program.messageList[1], `Хотите сгенерировать тестовых данных?`);
        });
  });

  it(`should ask user until get "yes" answer`, () => {
    return program.waitForLine(`Хотите сгенерировать тестовых данных?`)
        .then(() => {
          program.send(`ashdu`);

          return program.waitForLine(`Хотите сгенерировать тестовых данных?`)
        })
        .then(() => {
          assert.equal(program.messageList[2], `Ответьте "y" или "yes"`);
          assert.equal(program.messageList[3], `Хотите сгенерировать тестовых данных?`);
        });
  });

  it(`should request amount for data generation`, () => {
    program.send(`y`);
    return program.waitForLine(`Сколько сущностей будем генерировать?`)
        .then(() => {
          assert.equal(program.messageList[2], `Сколько сущностей будем генерировать?`);
        });
  });

  it(`should ask user until get correct amount`, () => {
    program.send(`y`);
    return program.waitForLine(`Сколько сущностей будем генерировать?`)
        .then(() => {
          program.send(`y`);
          return program.waitForLine(`Сколько сущностей будем генерировать?`);
        })
        .then(() => {
          assert.equal(program.messageList[3], `"y" — не число. Введите число.`);
          assert.equal(program.messageList[4], `Сколько сущностей будем генерировать?`);
        });
  });

  it(`should request destination filename for data generation`, () => {
    program.send(`y`);
    return program.waitForLine(`Сколько сущностей будем генерировать?`)
        .then(() => {
          program.send(`5`);
          return program.waitForLine(`Куда сохранить сгенерированные данные? (введите имя файла)`);
        })
        .then(() => {
          assert.equal(program.messageList[3], `Куда сохранить сгенерированные данные? (введите имя файла)`);
        });
  });

  it(`should request path until correct path to be provided`, () => {
    program.send(`y`);
    return program.waitForLine(`Сколько сущностей будем генерировать?`)
        .then(() => {
          program.send(`5`);
          return program.waitForLine(`Куда сохранить сгенерированные данные? (введите имя файла)`);
        })
        .then(() => {
          program.send(`package.json`);
          return program.waitForLine(`Куда сохранить сгенерированные данные? (введите имя файла)`);
        }).then(() => {
          assert.equal(program.messageList[4], `"package.json" уже существует. Перезаписать?`);
          assert.equal(program.messageList[5], `Куда сохранить сгенерированные данные? (введите имя файла)`);
        });
  });

  it(`should create file with requested amount of mock data`, () => {
    program.send(`y`);
    return program.waitForLine(`Сколько сущностей будем генерировать?`)
        .then(() => {
          program.send(`5`);
          return program.waitForLine(`Куда сохранить сгенерированные данные? (введите имя файла)`);
        })
        .then(() => {
          program.send(`test-data.json`);
          return program.waitForLine(`"test-data.json" сохранен`);
        })
        .then(() => {
          assert.equal(program.messageList[4], `"test-data.json" сохранен`);
          return exists(path.join(process.cwd(), `test-data.json`));
        })
        .then((isExists) => assert.ok(isExists))
        .then(() => {
          const data = require(path.join(process.cwd(), `test-data.json`));

          assert.equal(data.length, 5);
        })
        .then(() => {
          const data = require(path.join(process.cwd(), `test-data.json`));
          assert.ok(data[0].offer);
        });
  });
});

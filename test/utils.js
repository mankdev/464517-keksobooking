const {fork} = require(`child_process`);

class Program {
  constructor(program, messageList) {
    this._program = program;
    this.messageList = messageList;
  }

  send(message) {
    this._program.stdin.write(`${message}\n`);
  }

  waitForLine(message) {
    return new Promise((resolve) => {
      const dataHandler = (data) => {
        if (data.trim() === message) {
          this._program.stdout.removeListener(`data`, dataHandler);
          resolve();
        }
      };

      this._program.stdout.on(`data`, dataHandler);
    });
  }

  kill() {
    this._program.removeAllListeners();
    this._program.kill();
  }

  static create() {
    return new Promise((resolve) => {
      const messageList = [];
      const program = fork(`./index.js`, {
        stdio: [`pipe`, `pipe`, `pipe`, `ipc`]
      });
      program.stdout.setEncoding(`utf8`);
      program.stderr.setEncoding(`utf8`);

      process.nextTick(() => {
        const onFirstMessage = () => {
          program.stdout.removeListener(`data`, onFirstMessage);
          resolve(new Program(program, messageList));
        };
        program.stdout.on(`data`, (data) => {
          messageList.push(data.trim());
        });
        program.stdout.on(`data`, onFirstMessage);
      });
    });
  }
}

module.exports = {
  Program
};

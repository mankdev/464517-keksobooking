const {server} = require(`../server`);

const DEFAULT_PORT = 3000;

function serverHandler() {
  let [port] = process.argv.slice(3);
  port = port || DEFAULT_PORT;
  server.listen(port, (err) => {
    if (err) {
      console.log(`Error happens`, err);
    } else {
      console.log(`Server started in ${port}`);
    }
  });
}

module.exports = {
  aliases: [`--server`, `-s`],
  description: `запускает сервер`,
  execute: serverHandler,
};

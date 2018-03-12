const {SERVER_PORT, SERVER_HOST} = require(`../../config`);

const {createServer} = require(`../server`);
const {logger} = require(`../utils/logger`);

const DEFAULT_PORT = SERVER_PORT;

function serverHandler() {
  const {offersStore} = require(`../server/offers/store`);
  const {imagesStore} = require(`../server/images/store`);

  const server = createServer(offersStore, imagesStore);
  let [port] = process.argv.slice(3);
  port = port || DEFAULT_PORT;

  server.listen(port, SERVER_HOST, (err) => {
    if (err) {
      logger.error(`Error happens during start up`, err);
    } else {
      logger.info(`Server started on http://${SERVER_HOST}:${port}`);
    }
  });
}

module.exports = {
  aliases: [`--server`, `-s`],
  description: `запускает сервер`,
  execute: serverHandler,
};

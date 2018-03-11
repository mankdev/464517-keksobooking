const {SERVER_PORT, SERVER_HOST} = require(`../../config`);

const {createServer} = require(`../server`);

const DEFAULT_PORT = SERVER_PORT;

const {mockOfferStore} = require(`../../test/server/offers/offerStore.mock`);
const {mockImageStore} = require(`../../test/server/offers/imageStore.mock`);


function serverHandler() {
  const server = createServer(mockOfferStore, mockImageStore);
  let [port] = process.argv.slice(3);
  port = port || DEFAULT_PORT;

  server.listen(port, SERVER_HOST, (err) => {
    if (err) {
      console.log(`Error happens`, err);
    } else {
      console.log(`Server started on http://${SERVER_HOST}:${port}`);
    }
  });
}

module.exports = {
  aliases: [`--server`, `-s`],
  description: `запускает сервер`,
  execute: serverHandler,
};

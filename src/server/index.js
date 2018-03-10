const express = require(`express`);
const {offersRoute} = require(`./offers`);

const server = express();


server.use(express.static(`static`));
server.use(`/api/offers`, offersRoute);

module.exports = {
  server
};

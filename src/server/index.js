const express = require(`express`);
const {offersRoute} = require(`./offers`);
const {ValidationError} = require(`./utils/errors`);

const server = express();

server.use(express.static(`static`));
server.use(`/api/offers`, offersRoute);

server.use(`/api/:unimplementedResource`, (req, res) => {
  res.status(501).send(`Not Implemented`);
});

server.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    res.status(400);
    res.json(error.errors);
    res.end();
  }

  next();
});

module.exports = {
  server
};

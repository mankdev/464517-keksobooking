const express = require(`express`);
const {createOffersRoute} = require(`./offers`);
const {ValidationError, NotFoundError} = require(`./utils/errors`);

const createServer = (offersStore, imageStore) => {
  const server = express();

  server.use(express.static(`static`));
  server.use(`/api/offers`, createOffersRoute(offersStore, imageStore));

  server.use(`/api/:unimplementedResource`, (req, res) => {
    res.status(501).send(`Not Implemented`);
  });

  server.use((error, req, res, next) => {
    if (error instanceof ValidationError) {
      res.status(400);
      res.json(error.errors);
      res.end();
    }

    if (error instanceof NotFoundError) {
      res.status(404);
      res.json([error]);
    }

    next();
  });

  return server;
}

module.exports = {
  createServer
};

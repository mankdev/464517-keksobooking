const express = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const {generateEntities} = require(`../utils/entities.utils`);

const server = express();
const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP = 0;
const upload = multer({storage: multer.memoryStorage()});

server.use(express.static(`static`));
server.use(bodyParser.json());

const offers = generateEntities(20);

const prepareData = (data, limit = DEFAULT_LIMIT, skip = DEFAULT_SKIP) => data.slice(skip, skip + limit);
const findOfferByDate = (data, date) => data.filter((offer) => offer.date === date);

server.get(`/api/offers`, (req, res) => {
  const {query} = req;
  res.send(prepareData(offers, query.limit, query.skip));
});

server.get(`/api/offers/:date`, (req, res) => {
  const {params} = req;
  const date = parseInt(params.date, 10);

  const result = findOfferByDate(offers, date);

  if (result.length) {
    res.send(result);
  } else {
    res.status(404)
        .end();
  }
});

server.post(`/api/offers`, upload.single(`avatar`), (req, res) => {
  const result = Object.assign({}, req.body);

  if (req.file) {
    result.author = {
      avatar: `/api/offers/${req.body.date}/avatar`
    };
  }

  res.send(result);
});

module.exports = {
  server
};

const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const {generateEntities} = require(`../../utils/entities.utils`);
const {validate} = require(`./validate`);
const {deserialize} = require(`./deserialize`);
const {ValidationError} = require(`../utils/errors`);

const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP = 0;
const upload = multer({storage: multer.memoryStorage()});

const route = new Router();
route.use(bodyParser.json());

const offers = generateEntities(20);

const prepareData = (data, limit = DEFAULT_LIMIT, skip = DEFAULT_SKIP) => data.slice(skip, skip + limit);
const findOfferByDate = (data, date) => data.filter((offer) => offer.date === date);
// const deserializeData = (data, files) =>


route.get(``, (req, res) => {
  const {query} = req;
  res.send(prepareData(offers, query.limit, query.skip));
});

route.get(`/:date`, (req, res) => {
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

route.post(``, upload.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}]), (req, res) => {
  const data = deserialize(req.body, req.files);
  const validationResults = validate(data);

  if (!validationResults.isValid) {
    throw new ValidationError(validationResults.errors);
  } else {
    res.send(data);
  }
});

module.exports = {
  offersRoute: route
};

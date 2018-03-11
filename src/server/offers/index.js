const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const {validate} = require(`./validate`);
const {deserialize} = require(`./deserialize`);
const {ValidationError} = require(`../utils/errors`);
const {createAsyncHandler} = require(`../utils/createAsyncHandler`);

const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP = 0;
const upload = multer({storage: multer.memoryStorage()});

const route = new Router();
route.use(bodyParser.json());

route.get(``, createAsyncHandler(async (req, res) => {
  const {query: {limit = DEFAULT_LIMIT, skip = DEFAULT_SKIP}} = req;
  const data = await (await route.offersStore.getAllOffers()).skip(skip).limit(limit).toArray();

  res.send(data);
}));

route.get(`/:date`, createAsyncHandler(async (req, res) => {
  const {params} = req;
  const date = parseInt(params.date, 10);

  const result = await route.offersStore.getOfferByDate(date);

  if (result) {
    res.send(result);
  } else {
    res.status(404)
        .end();
  }
}));

route.post(``, upload.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}]), (req, res) => {
  const data = deserialize(req.body, req.files);
  const validationResults = validate(data);

  if (!validationResults.isValid) {
    throw new ValidationError(validationResults.errors);
  } else {
    res.send(data);
  }
});

const createOffersRoute = (offersStore, imageStore) => {
  route.offersStore = offersStore;
  route.imageStore = imageStore;

  return route;
};

module.exports = {
  createOffersRoute
};

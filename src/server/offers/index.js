const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const {Duplex} = require(`stream`);
const multer = require(`multer`);
const {validate} = require(`./validate`);
const {deserialize} = require(`./deserialize`);
const {ValidationError, NotFoundError} = require(`../utils/errors`);
const {createAsyncHandler} = require(`../utils/create-async-handler`);
const {generateDate, generateEntityLocation} = require(`../../utils/entities.utils`);
const {logger} = require(`../../utils/logger`);

const createStreamFromBuffer = (buffer) => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP = 0;
const upload = multer({storage: multer.memoryStorage()});

const route = new Router();
route.use(bodyParser.json());

route.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
});

route.get(``, createAsyncHandler(async (req, res) => {
  const {query: {limit = DEFAULT_LIMIT, skip = DEFAULT_SKIP}} = req;
  const data = await (await route.offersStore.getAllOffers())
      .skip(parseInt(skip, 10))
      .limit(parseInt(limit, 10))
      .toArray();

  res.send(data);
}));

route.get(`/:date`, createAsyncHandler(async (req, res) => {
  const {params} = req;
  const date = parseInt(params.date, 10);

  const result = await route.offersStore.getOfferByDate(date);

  if (result) {
    res.send(result);
  } else {
    throw new NotFoundError(`Offer for date ${new Date(date)} not found`);
  }
}));

route.get(`/:date/avatar`, createAsyncHandler(async (req, res) => {
  const date = parseInt(req.params.date, 10);

  const result = await route.offersStore.getOfferByDate(date);

  if (!result) {
    throw new NotFoundError(`Offer for date ${new Date(date)} not found`);
  }

  const {author: {avatar}} = result;

  if (!avatar) {
    throw new NotFoundError(`Avatar for offer with date ${new Date(date)} not found`);
  }

  const {info, stream} = await route.imageStore.get(avatar);

  if (!info) {
    throw new NotFoundError(`Avatar for offer with date ${new Date(date)} not found`);
  }

  res.set(`content-type`, info.contentType);
  res.set(`content-length`, info.length);
  res.status(200);
  stream.pipe(res);
}));

route.get(`/:date/preview`, createAsyncHandler(async (req, res) => {
  const date = parseInt(req.params.date, 10);

  const result = await route.offersStore.getOfferByDate(date);

  if (!result) {
    throw new NotFoundError(`Offer for date ${new Date(date)} not found`);
  }

  const {offer: {preview}} = result;

  if (!preview) {
    throw new NotFoundError(`Preview for offer with date ${new Date(date)} not found`);
  }

  const {info, stream} = await route.imageStore.get(preview);

  if (!info) {
    throw new NotFoundError(`Preview for offer with date ${new Date(date)} not found`);
  }

  res.set(`content-type`, info.contentType);
  res.set(`content-length`, info.length);
  res.status(200);
  stream.pipe(res);
}));

route.post(``,
    upload.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}]),
    createAsyncHandler(async (req, res) => {
      logger.info(`data received from user`, req.body);
      const offer = deserialize(req.body, req.files);
      const data = {};
      const validationResults = validate(offer);

      if (!validationResults.isValid) {
        throw new ValidationError(validationResults.errors);
      } else {
        const date = generateDate();
        const location = generateEntityLocation();
        const avatarPath = `/api/offers/${date}/avatar`;
        const previewPath = `/api/offers/${date}/preview`;

        if (offer.avatar) {
          await route.imageStore.save(avatarPath, offer.avatar.mimetype, createStreamFromBuffer(offer.avatar.buffer));
          delete offer.avatar;
          logger.info(`new avatar available:`, {avatarPath});
          data.author = {
            avatar: avatarPath
          };
        }

        if (offer.preview) {
          await route.imageStore.save(previewPath, offer.preview.mimetype, createStreamFromBuffer(offer.preview.buffer));
          logger.info(`new preview available:`, {previewPath});
          offer.preview = previewPath;
        }

        data.date = date;
        data.offer = offer;
        data.location = location;

        await route.offersStore.save(data);

        res.send(data);
      }
    })
);

const createOffersRoute = (offersStore, imageStore) => {
  route.offersStore = offersStore;
  route.imageStore = imageStore;

  return route;
};

module.exports = {
  createOffersRoute
};

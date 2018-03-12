const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const {Duplex} = require(`stream`);
const multer = require(`multer`);
const {validate} = require(`./validate`);
const {deserialize} = require(`./deserialize`);
const {ValidationError, NotFoundError} = require(`../utils/errors`);
const {createAsyncHandler} = require(`../utils/createAsyncHandler`);
const {generateDate, generateEntityLocation} = require(`../../utils/entities.utils`);

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
    throw new NotFoundError(`Offer for date ${new Date(date)} not found`);
  }
}));

route.get(`/:date/avatar`, createAsyncHandler(async (req, res) => {
  const date = parseInt(req.params.date, 10);

  const result = await route.offersStore.getOfferByDate(date);

  const {author: {avatar}} = result;

  const {info, stream} = await route.imageStore.get(avatar);

  res.set(`content-type`, info.contentType);
  res.set(`content-length`, info.length);
  res.status(200);
  stream.pipe(res);
}));

route.get(`/:date/preview`, createAsyncHandler(async (req, res) => {
  const date = parseInt(req.params.date, 10);

  const result = await route.offersStore.getOfferByDate(date);

  const {offer: {preview}} = result;

  const {info, stream} = await route.imageStore.get(preview);

  res.set(`content-type`, info.contentType);
  res.set(`content-length`, info.length);
  res.status(200);
  stream.pipe(res);
}));

route.post(``,
    upload.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}]),
    createAsyncHandler(async (req, res) => {
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
          data.author = {
            avatar: avatarPath
          };
        }

        if (offer.preview) {
          await route.imageStore.save(previewPath, offer.preview.mimetype, createStreamFromBuffer(offer.preview.buffer));
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

const createAsyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = {
  createAsyncHandler
};

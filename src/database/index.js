const {DB_HOST} = require(`../../config`);
const {MongoClient} = require(`mongodb`);

const {logger} = require(`../utils/logger`);

const [dbServer, dbName] = DB_HOST.split(`/`);

const url = `mongodb://${dbServer}`;

module.exports = {
  database: MongoClient
      .connect(url)
      .then((client) => client.db(dbName))
      .catch((err) => {
        logger.error(`Failed to connect to MongoDB`, {err, message: err.message});
        process.exit(1);
      })
};


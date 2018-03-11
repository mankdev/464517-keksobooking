const {DB_HOST} = require(`../../config`);
const {MongoClient} = require(`mongodb`);

const [dbServer, dbName] = DB_HOST.split(`/`);

const url = `mongodb://${dbServer}`;

module.exports = {
  database: MongoClient
      .connect(url)
      .then((client) => client.db(dbName))
      .catch((err) => {
        console.error(`Failed to connect to MongoDB`, err);
        process.exit(1);
      })
}


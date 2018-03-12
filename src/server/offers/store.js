const {database} = require(`../../database`);
const {logger} = require(`../../utils/logger`);

const setupCollection = async () => {
  const db = await database;

  return db.collection(`offers`);
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getAllOffers() {
    return (await this.collection).find();
  }

  async getOfferByDate(date) {
    const result = await (await this.collection).find({date}).toArray();
    if (!result.length) {
      return null;
    } else {
      return result[result.length - 1];
    }
  }

  async save(offer) {
    return (await this.collection).insertOne(offer);
  }
}

module.exports = {
  offersStore: new OffersStore(setupCollection()
      .catch((err) => logger.error(`Failed to set up "offers" collection`, err)))
};

const {database} = require(`../../database`);
const {Cursor} = require(`../../utils`);

const setupCollection = async () => {
  const db = await database;

  return db.collection(`offers`);
}

class OfferStore {
  constructor() {
    this._data = generateEntities(20);
  }

  async getAllOffers() {
    return new Cursor(this._data);
  }

  async getOfferByDate(date) {
    return this._data.find((item) => item.date === date);
  }

  async save() {

  }
}

module.exports = {
  MockOfferStore
};

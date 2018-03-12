const {generateEntities} = require(`../../../src/utils/entities.utils`);
const {Cursor} = require(`../../utils`);

class MockOfferStore {
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
  mockOfferStore: new MockOfferStore()
};

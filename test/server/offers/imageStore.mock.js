const {generateEntities} = require(`../../../src/utils/entities.utils`);

class MockImageStore {
  constructor() {
    this._data = generateEntities(20);
  }

  async getBucket() {}

  async get() {}

  async save() {}
}

module.exports = {
  mockImageStore: new MockImageStore()
};

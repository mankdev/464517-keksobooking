const assert = require(`assert`);
const {validate} = require(`../src/server/offers/validate`);

const VALID_SAMPLE = {
  title: `Роскошная вилла на берегу озера`,
  type: `flat`,
  price: 500,
  address: `Озерная улица дом 1`,
  checkin: `12:00`,
  checkout: `12:00`,
  rooms: 5,
  features: [`dishwasher`, `elevator`],
  avatar: {
    fieldname: `avatar`,
    mimetype: `image/png`,
    size: 999
  },
  preview: {
    fieldname: `avatar`,
    mimetype: `image/png`,
    size: 999
  },
  name: `Keks`
};

const expectValidationFailed = (result) => {
  assert.equal(result.isValid, false);
};

describe.only(`offer validation helper`, () => {
  let sample;

  beforeEach(() => {
    sample = Object.assign({}, VALID_SAMPLE);
  });

  it(`should accepts valid sample`, () => {
    const result = validate(VALID_SAMPLE);

    assert.ok(result.isValid);
    assert.equal(Object.keys(result.errors).length, 0);
  });

  describe(`"title" field`, () => {
    it(`should be required`, () => {
      delete sample.title;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.title, `это поле обязательно`);
    });

    it(`should has length between 30 and 100`, () => {
      sample.title = `qwe`;

      const shortTitleResult = validate(sample);

      sample.title = new Array(200).join(`a`);

      const longTitleResults = validate(sample);

      expectValidationFailed(shortTitleResult);
      expectValidationFailed(longTitleResults);

      assert.equal(shortTitleResult.errors.title, `должно быть больше 30 символов`);
      assert.equal(longTitleResults.errors.title, `должно быть короче 100 символов`);
    });
  });
  describe(`"type" field`, () => {
    it(`should be required`, () => {
      delete sample.type;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.type, `это поле обязательно`);
    });

    it(`should has one of predefined value`, () => {
      sample.type = `asdqwe`;

      const result = validate(sample);
      expectValidationFailed(result);
      assert.equal(result.errors.type, `не верное значение`);
    });
  });

  describe(`"price" field`, () => {
    it(`should be required`, () => {
      delete sample.price;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.price, `это поле обязательно`);
    });

    it(`should be between 1 and 100000`, () => {
      sample.price = 0;

      const lowPriceResult = validate(sample);

      sample.price = 200000;

      const highPriceResults = validate(sample);

      expectValidationFailed(lowPriceResult);
      expectValidationFailed(highPriceResults);

      assert.equal(lowPriceResult.errors.price, `должно быть больше 0`);
      assert.equal(highPriceResults.errors.price, `должно быть не больше 100 000`);
    });
  });
});

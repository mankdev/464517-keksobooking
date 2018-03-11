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
  guests: 4,
  features: [`dishwasher`, `elevator`],
  avatar: {
    fieldname: `avatar`,
    mimetype: `image/png`,
    size: 999
  },
  preview: {
    fieldname: `preview`,
    mimetype: `image/png`,
    size: 999
  },
  name: `Keks`
};

const expectValidationFailed = (result) => {
  assert.equal(result.isValid, false);
};

describe(`offer validation helper`, () => {
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

      sample.title = new Array(102).join(`a`);

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

      sample.price = 100001;

      const highPriceResults = validate(sample);

      expectValidationFailed(lowPriceResult);
      expectValidationFailed(highPriceResults);

      assert.equal(lowPriceResult.errors.price, `должно быть больше 0`);
      assert.equal(highPriceResults.errors.price, `должно быть не больше 100 000`);
    });
  });

  describe(`"address" field`, () => {
    it(`should be required`, () => {
      delete sample.address;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.address, `это поле обязательно`);
    });

    it(`should has length less than 1000`, () => {
      sample.address = new Array(1002).join(`a`);

      const results = validate(sample);

      expectValidationFailed(results);

      assert.equal(results.errors.address, `должно быть короче 1000 символов`);
    });
  });

  describe(`"rooms" field`, () => {
    it(`should be required`, () => {
      delete sample.rooms;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.rooms, `это поле обязательно`);
    });

    it(`should be between 0 and 1000`, () => {
      sample.rooms = -1;

      const fewRoomsResult = validate(sample);

      sample.rooms = 1001;

      const manyRoomsResults = validate(sample);

      expectValidationFailed(fewRoomsResult);
      expectValidationFailed(manyRoomsResults);

      assert.equal(fewRoomsResult.errors.rooms, `должно быть больше или равно 0`);
      assert.equal(manyRoomsResults.errors.rooms, `должно быть не больше 1000`);
    });
  });

  describe(`"name" field`, () => {
    it(`should be optional`, () => {
      delete sample.name;

      const result = validate(sample);
      assert.ok(result.isValid);
      assert.equal(Object.keys(result.errors).length, 0);
    });

    it(`should be one of predefined value`, () => {
      sample.name = `blabla`;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.name, `не верное значение`);
    });
  });

  describe(`"checkin" field`, () => {
    it(`should be required`, () => {
      delete sample.checkin;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.checkin, `это поле обязательно`);
    });

    it(`should be valid time string with following format "HH:mm"`, () => {
      sample.checkin = `12:30:33`;

      const resultWithAdditionalInfo = validate(sample);

      sample.checkin = `HH:mm`;

      const resultWithText = validate(sample);

      sample.checkin = `25:15`;

      const resultWithExtraHour = validate(sample);

      sample.checkin = `24:61`;

      const resultWithExtraMinute = validate(sample);

      expectValidationFailed(resultWithAdditionalInfo);
      expectValidationFailed(resultWithText);
      expectValidationFailed(resultWithExtraHour);
      expectValidationFailed(resultWithExtraMinute);

      assert.equal(resultWithAdditionalInfo.errors.checkin, `не верное значение`);
      assert.equal(resultWithText.errors.checkin, `не верное значение`);
      assert.equal(resultWithExtraHour.errors.checkin, `не верное значение`);
      assert.equal(resultWithExtraMinute.errors.checkin, `не верное значение`);
    });
  });

  describe(`"checkout" field`, () => {
    it(`should be required`, () => {
      delete sample.checkout;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.checkout, `это поле обязательно`);
    });

    it(`should be valid time string with following format "HH:mm"`, () => {
      sample.checkout = `12:30:33`;

      const resultWithAdditionalInfo = validate(sample);

      sample.checkout = `HH:mm`;

      const resultWithText = validate(sample);

      sample.checkout = `25:15`;

      const resultWithExtraHour = validate(sample);

      sample.checkout = `24:61`;

      const resultWithExtraMinute = validate(sample);

      expectValidationFailed(resultWithAdditionalInfo);
      expectValidationFailed(resultWithText);
      expectValidationFailed(resultWithExtraHour);
      expectValidationFailed(resultWithExtraMinute);

      assert.equal(resultWithAdditionalInfo.errors.checkout, `не верное значение`);
      assert.equal(resultWithText.errors.checkout, `не верное значение`);
      assert.equal(resultWithExtraHour.errors.checkout, `не верное значение`);
      assert.equal(resultWithExtraMinute.errors.checkout, `не верное значение`);
    });
  });

  describe(`"features" field`, () => {
    it(`should be optional`, () => {
      delete sample.features;

      const result = validate(sample);
      assert.ok(result.isValid);
      assert.equal(Object.keys(result.errors).length, 0);
    });

    it(`should has only predefined values`, () => {
      sample.features = [`dishwasher`, `blabla`];

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.features, `не верное значение`);
    });

    it(`should has only unique values`, () => {
      sample.features = [`dishwasher`, `dishwasher`];

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.features, `не верное значение`);
    });
  });

  describe(`"avatar" field`, () => {
    it(`should be optional`, () => {
      delete sample.avatar;

      const result = validate(sample);
      assert.ok(result.isValid);
      assert.equal(Object.keys(result.errors).length, 0);
    });

    it(`should be file with correct mime-type`, () => {
      sample.avatar = {
        mimetype: `text/html`
      };

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.avatar, `не верное значение`);
    });
  });

  describe(`"preview" field`, () => {
    it(`should be optional`, () => {
      delete sample.preview;

      const result = validate(sample);
      assert.ok(result.isValid);
      assert.equal(Object.keys(result.errors).length, 0);
    });

    it(`should be file with correct mime-type`, () => {
      sample.preview = {
        mimetype: `text/html`
      };

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.preview, `не верное значение`);
    });
  });

  describe(`"guests" field`, () => {
    it(`should be required`, () => {
      delete sample.guests;

      const result = validate(sample);
      expectValidationFailed(result);

      assert.equal(result.errors.guests, `это поле обязательно`);
    });

    it(`should be between 1 and 100`, () => {
      sample.guests = 0;

      const fewGuestsResult = validate(sample);

      sample.guests = 101;

      const manyGuestsResults = validate(sample);

      expectValidationFailed(fewGuestsResult);
      expectValidationFailed(manyGuestsResults);

      assert.equal(fewGuestsResult.errors.guests, `должно быть больше или равно 1`);
      assert.equal(manyGuestsResults.errors.guests, `должно быть не больше 100`);
    });
  });
});

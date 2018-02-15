const assert = require(`assert`);
const {generateEntity} = require(`../src/utils/generateEntity`);

const POSSIBLE_TITLES = [
  `Большая уютная квартира`,
  `Маленькая неуютная квартира`,
  `Огромный прекрасный дворец`,
  `Маленький ужасный дворец`,
  `Красивый гостевой домик`,
  `Некрасивый негостеприимный домик`,
  `Уютное бунгало далеко от моря`,
  `Неуютное бунгало по колено в воде`
];

describe(`#generateEntity`, () => {
  it(`should generate "author" section`, () => {
    assert.ok(generateEntity().author);
  });
  describe(`author.avatar`, () => {
    it(`should be an url`, () => {
      const avatarRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
      const {author} = generateEntity();
      assert.ok(avatarRegex.test(author.avatar));
    });
  });
});

describe(`"offer" section`, () => {
  it(`should generate "offer" section`, () => {
    assert.ok(generateEntity().offer);
  });
  describe(`offer.title`, () => {
    it(`should return one of predefined list of titles`, () => {
      const {offer: {title}} = generateEntity();

      assert.ok(POSSIBLE_TITLES.indexOf(title) > -1);
    });

    it(`should be unique value`, () => {
      const previousList = [];
      for (let i = POSSIBLE_TITLES.length - 1; i > -1; i--) {
        const {offer: {title}} = generateEntity();

        assert.ok(previousList.indexOf(title) === -1);

        previousList.push(title);
      }
    });
  });
  describe(`offer.address`, () => {
    const entity = generateEntity();

    assert.equal(entity.offer.address, `{{${entity.location.x}}}, {{${entity.location.y}}}`);
  });

  describe(`offer.price`, () => {
    it(`should be between 1000 and 1 000 000`, () => {
      const {offer: {price}} = generateEntity();

      assert.ok(price >= 1000);
      assert.ok(price <= 1000000);
    });
  });
});

describe(`"location" section`, () => {
  describe(`location.x`, () => {
    it(`should be between 300 and 900`, () => {
      const entity = generateEntity();

      assert.ok(entity.location.x >= 300);
      assert.ok(entity.location.x <= 900);
    });
  });

  describe(`location.y`, () => {
    it(`should be between 150 and 500`, () => {
      const entity = generateEntity();

      assert.ok(entity.location.y >= 150);
      assert.ok(entity.location.y <= 500);
    });
  });
});

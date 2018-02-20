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

const TIMES = [
  `12:00`,
  `13:00`,
  `14:00`
];

const FEATURE_LIST = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];

const PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];

describe(`#generateEntity`, () => {
  it(`should generate "author" section`, () => {
    assert.ok(generateEntity().author);
  });

  it(`"author.avatar" should be an url`, () => {
    const avatarRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    const {author} = generateEntity();
    assert.ok(avatarRegex.test(author.avatar));
  });

  it(`should generate "offer" section`, () => {
    assert.ok(generateEntity().offer);
  });

  it(`"offer.title" should return one of predefined list of titles`, () => {
    const {offer: {title}} = generateEntity();

    assert.ok(POSSIBLE_TITLES.indexOf(title) > -1);
  });

  it(`"offer.title" should be unique value`, () => {
    const previousList = [];
    for (let i = POSSIBLE_TITLES.length - 1; i > -1; i--) {
      const {offer: {title}} = generateEntity();

      assert.ok(previousList.indexOf(title) === -1);

      previousList.push(title);
    }
  });
  it(`"offer.address" should have predefined format ({{x}},{{y}})`, () => {
    const entity = generateEntity();

    assert.equal(entity.offer.address, `{{${entity.location.x}}}, {{${entity.location.y}}}`);
  });

  it(`"offer.price" should be between 1000 and 1 000 000`, () => {
    const {offer: {price}} = generateEntity();

    assert.ok(price >= 1000);
    assert.ok(price <= 1000000);
  });

  it(`"offer.rooms" should be between`, () => {
    const {offer: {rooms}} = generateEntity();

    assert.ok(rooms >= 1);
    assert.ok(rooms <= 5);
  });

  it(`"offer.guests" should be random number of guests`, () => {
    const {offer: {guests}} = generateEntity();
    assert.ok(guests > 0);
  });

  it(`"offer.checkin" should be one of predefined value`, () => {
    const {offer: {checkin}} = generateEntity();
    assert.ok(TIMES.indexOf(checkin) > -1);
  });

  it(`"offer.checkout" should be one of predefined value`, () => {
    const {offer: {checkout}} = generateEntity();
    assert.ok(TIMES.indexOf(checkout) > -1);
  });

  it(`"offer.features" should be a set of predefined values`, () => {
    const {offer: {features}} = generateEntity();

    assert.ok(!!features.length);
    features.forEach((feature) => assert.ok(FEATURE_LIST.indexOf(feature) > -1));
  });

  it(`"offer.description" should be empty string`, () => {
    const {offer: {description}} = generateEntity();

    assert.equal(description, ``);
  });

  it(`"offer.photos" should be set of 3 images`, () => {
    const {offer: {photos}} = generateEntity();
    assert.equal(photos.length, 3);
  });

  it(`"offer.photos" should be random list of predefined values`, () => {
    const {offer: {photos}} = generateEntity();
    photos.forEach((photo) => assert.ok(PHOTOS.indexOf(photo) > -1));
  });

  it(`"location.x" should be between 300 and 900`, () => {
    const entity = generateEntity();

    assert.ok(entity.location.x >= 300);
    assert.ok(entity.location.x <= 900);
  });

  it(`"location.y" should be between 150 and 500`, () => {
    const entity = generateEntity();

    assert.ok(entity.location.y >= 150);
    assert.ok(entity.location.y <= 500);
  });
});

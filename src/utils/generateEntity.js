const superheroes = require(`superheroes`);

const TITLES = [
  `Большая уютная квартира`,
  `Маленькая неуютная квартира`,
  `Огромный прекрасный дворец`,
  `Маленький ужасный дворец`,
  `Красивый гостевой домик`,
  `Некрасивый негостеприимный домик`,
  `Уютное бунгало далеко от моря`,
  `Неуютное бунгало по колено в воде`
];

const MIN_PRICE = 1000;
const MAX_PRICE = 1000000;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 5;

const MIN_GUESTS_PER_ROOM = 1;
const MAX_GUESTS_PER_ROOM = 3;

const CHEK_IN_OUT_TIMES = [
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

const MIN_X = 300;
const MAX_X = 900;
const MIN_Y = 150;
const MAX_Y = 500;

const randomFromRange = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const randomElement = (arr) => arr[randomFromRange(0, arr.length - 1)];
const shuffle = (arr) => ([...arr]).sort(() => Math.random() - 0.5);

const generateTitle = (function () {
  let shuffledTitleIndexes = shuffle([...Array(TITLES.length).keys()]);

  return function getNextTitle() {
    const index = shuffledTitleIndexes.pop();
    shuffledTitleIndexes = [index, ...shuffledTitleIndexes];
    return TITLES[index];
  };
})();

module.exports = {
  generateEntity() {
    const location = {
      x: randomFromRange(MIN_X, MAX_X),
      y: randomFromRange(MIN_Y, MAX_Y)
    };

    return {
      author: {
        avatar: `https://robohash.org/${superheroes.random()}`
      },
      offer: {
        title: generateTitle(),
        address: `{{${location.x}}}, {{${location.y}}}`,
        price: randomFromRange(MIN_PRICE, MAX_PRICE),
        rooms: randomFromRange(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT),
        guests: randomFromRange(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT) *
          randomFromRange(MIN_GUESTS_PER_ROOM, MAX_GUESTS_PER_ROOM),
        checkin: randomElement(CHEK_IN_OUT_TIMES),
        checkout: randomElement(CHEK_IN_OUT_TIMES),
        features: shuffle(FEATURE_LIST).slice(randomFromRange(0, FEATURE_LIST.length - 1)),
        description: ``,
        photos: shuffle(PHOTOS),
      },
      location
    };
  }
};

const superheroes = require(`superheroes`);

const TYPES = [`flat`, `house`, `bungalo`, `palace`];
const NAMES = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];

const TITLES = [
  `Большая уютная квартира для семьи`,
  `Маленькая неуютная квартира на одного`,
  `Огромный прекрасный дворец для друзей`,
  `Маленький ужасный дворец для вечеринок`,
  `Красивый гостевой домик для кота`,
  `Некрасивый негостеприимный домик`,
  `Уютное бунгало далеко от океана`,
  `Неуютное бунгало по колено в воде`
];

const MIN_PRICE = 1000;
const MAX_PRICE = 100000;

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

const MIN_X = 300;
const MAX_X = 900;
const MIN_Y = 150;
const MAX_Y = 500;

const randomFromRange = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const randomElement = (arr) => arr[randomFromRange(0, arr.length - 1)];
const shuffle = (arr) => ([...arr]).sort(() => Math.random() - 0.5);

const generateTitle = (function () {
  let shuffledTitleIndexes = shuffle([...Array(TITLES.length).keys()]);

  return () => {
    const index = shuffledTitleIndexes.pop();
    shuffledTitleIndexes = [index, ...shuffledTitleIndexes];
    return TITLES[index];
  };
})();

const generateDate = ((startDate = new Date(`2018-03-10`)) => {
  let prevousDate = startDate;

  return () => {
    const nextDate = new Date(prevousDate.getTime());

    nextDate.setDate(nextDate.getDate() + 1);
    prevousDate = nextDate;
    return nextDate.getTime();
  };
})();

const generateEntityLocation = () => {
  return {
    x: randomFromRange(MIN_X, MAX_X),
    y: randomFromRange(MIN_Y, MAX_Y)
  };
};

const generateEntity = () => {
  const location = generateEntityLocation();

  return {
    author: {
      avatar: `https://robohash.org/${superheroes.random()}`
    },
    offer: {
      title: generateTitle(),
      type: randomElement(TYPES),
      address: `{{${location.x}}}, {{${location.y}}}`,
      price: randomFromRange(MIN_PRICE, MAX_PRICE),
      rooms: randomFromRange(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT),
      guests: randomFromRange(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT) *
      randomFromRange(MIN_GUESTS_PER_ROOM, MAX_GUESTS_PER_ROOM),
      checkin: randomElement(CHEK_IN_OUT_TIMES),
      checkout: randomElement(CHEK_IN_OUT_TIMES),
      features: shuffle(FEATURE_LIST).slice(randomFromRange(0, FEATURE_LIST.length - 1)),
      description: ``,
      name: randomElement(NAMES)
    },
    location,
    date: generateDate()
  };
};

const generateEntities = (quantity) => {
  return Array.from(Array(quantity).keys()).map(() => {
    return generateEntity();
  });
};

module.exports = {
  generateEntity,
  generateEntities,
  generateDate,
  generateEntityLocation
};

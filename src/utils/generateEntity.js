const superheroes = require(`superheroes`);
const randomFromRange = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

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

const generateTitle = (function () {
  let shuffledTitleIndexes = ([...Array(TITLES.length).keys()]).sort(() => Math.random() - 0.5);

  return function getNextTitle() {
    const index = shuffledTitleIndexes.pop();
    shuffledTitleIndexes = [index, ...shuffledTitleIndexes];
    return TITLES[index];
  };
})();

module.exports = {
  generateEntity() {
    const location = {
      x: randomFromRange(300, 900),
      y: randomFromRange(150, 500)
    };

    return {
      author: {
        avatar: `https://robohash.org/${superheroes.random()}`
      },
      offer: {
        title: generateTitle(),
        address: `{{${location.x}}}, {{${location.y}}}`,
        price: randomFromRange(1000, 1000000),
        rooms: randomFromRange(1, 5),
        guests: randomFromRange(1, 5) * randomFromRange(1, 3),
        checkin: CHEK_IN_OUT_TIMES[randomFromRange(0, 2)],
        checkout: CHEK_IN_OUT_TIMES[randomFromRange(0, 2)],
        features: ([...FEATURE_LIST]).sort(() => Math.random() - 0.5).slice(randomFromRange(0, FEATURE_LIST.length)),
        description: ``,
        photos: ([...PHOTOS]).sort(() => Math.random() - 0.5),
      },
      location
    };
  }
};

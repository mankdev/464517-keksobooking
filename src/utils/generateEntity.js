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

const generateTitle = (function () {
  let shuffledTitleIndexes = ([...Array(TITLES.length).keys()]).sort(() => Math.random() - 0.5);

  return function getNextTitle() {
    const index = shuffledTitleIndexes.pop();
    shuffledTitleIndexes = [index, ...shuffledTitleIndexes];
    return TITLES[index];
  };
})();

// const generateLocation = () => {
//   const x = Math.floor(Math.random() * (900 + 1 - 300) + 300);
//   const y = Math.floor(Math.random() * (150 + 1 - 300) + 300);
// };

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
        price: randomFromRange(1000, 1000000)
      },
      location
    };
  }
};

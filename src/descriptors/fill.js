const https = require(`https`);
const {offersStore} = require(`../server/offers/store`);
const {imagesStore} = require(`../server/images/store`);
const {generateEntities} = require(`../utils/entities.utils`);

const DATA_COUNT = 20;

const fillHandler = () => {
  const offers = generateEntities(DATA_COUNT);

  Promise.all(offers.map((item) => {
    const avatarPath = `/api/offers/${item.date}/avatar`;
    const {author: {avatar}} = item;
    item.author.avatar = avatarPath;

    return new Promise((resolve) => {
      https.get(avatar, (response) => {
        return resolve(response);
      });
    }).then((stream) => {
      return Promise.all([offersStore.save(item), imagesStore.save(avatarPath, `image/png`, stream)]);
    });
  }))
      .then(() => console.log(`Успешно добавлено ${DATA_COUNT} записей`))
      .then(() => process.exit(0));
};

module.exports = {
  aliases: [`--fill`, `-f`],
  description: `наполняет базу тестовыми данными`,
  execute: fillHandler,
};

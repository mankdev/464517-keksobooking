const {offersStore} = require(`../server/offers/store`);
const {generateEntities} = require(`../utils/entities.utils`);

const DATA_COUNT = 20;

function fillHandler() {
  const offers = generateEntities(DATA_COUNT);

  Promise.all(offers.map((item) => offersStore.save(item)))
      .then(() => console.log(`Успешно добавлено ${DATA_COUNT} записей`))
      .then(() => process.exit(0));
}

module.exports = {
  aliases: [`--fill`, `-f`],
  description: `наполняет базу тестовыми данными`,
  execute: fillHandler,
};

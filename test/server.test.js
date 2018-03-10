const assert = require(`assert`);
const request = require(`supertest`);

const {server} = require(`../src/server`);

const SAMPLE_DATA = {
  title: `Уютное бунгало далеко от моря`,
  price: 205350,
  rooms: 5,
  guests: 4,
  checkin: `12:00`,
  checkout: `12:00`,
  description: ``,
  date: 1520726400000
};

describe(`GET /api/offers`, () => {
  it(`should server endpoint as json`, () => {
    return request(server)
        .get(`/api/offers`)
        .expect(`Content-Type`, /json/)
        .expect(200);
  });

  it(`should return all offers`, () => {
    return request(server)
        .get(`/api/offers`)
        .then((response) => {
          const offers = response.body;
          assert.equal(offers.length, 20);
          assert.equal(Object.keys(offers[0]).length, 4);
          assert.equal(Object.keys(offers[0].offer).length, 10);
        });
  });

  it(`should handle limit option`, () => {
    return request(server)
        .get(`/api/offers?limit=10`)
        .then((response) => {
          const offers = response.body;
          assert.equal(offers.length, 10);
        });
  });

  it(`should handle skip option`, () => {
    return request(server)
        .get(`/api/offers?skip=15`)
        .then((response) => {
          const offers = response.body;
          assert.equal(offers.length, 5);
        });
  });
});

describe(`GET /api/offers/:date`, () => {
  it(`should response with 404 error if offer not found`, () => {
    const date = new Date(`2018-03-09`);

    return request(server)
        .get(`/api/offers/${date.getTime()}`)
        .expect(404);
  });

  it(`should return offers with provided date`, () => {
    const date = new Date(`2018-03-11`);
    return request(server)
        .get(`/api/offers/${date.getTime()}`)
        .expect(200)
        .then(({body}) => {
          assert.equal(body.length, 1);
        });
  });
});

describe(`POST /api/offers`, () => {
  it(`should consume JSON`, () => {
    return request(server)
        .post(`/api/offers`)
        .send(SAMPLE_DATA)
        .expect(200, SAMPLE_DATA);
  });

  it(`should consume form-data`, () => {
    return request(server)
        .post(`/api/offers`)
        .field(`title`, `Уютное бунгало далеко от моря`)
        .field(`price`, 205350)
        .field(`rooms`, 5)
        .field(`guests`, 4)
        .field(`checkin`, `12:00`)
        .field(`checkout`, `12:00`)
        .field(`description`, ``)
        .field(`date`, 1520726400000)
        .expect(200, SAMPLE_DATA);
  });

  it(`should consume form-data with avatar`, () => {
    return request(server)
        .post(`/api/offers`)
        .field(`title`, `Уютное бунгало далеко от моря`)
        .field(`price`, 205350)
        .field(`rooms`, 5)
        .field(`guests`, 4)
        .field(`checkin`, `12:00`)
        .field(`checkout`, `12:00`)
        .field(`description`, ``)
        .field(`date`, 1520726400000)
        .attach(`avatar`, `test/fixtures/avatar.png`)
        .expect(200, Object.assign({}, SAMPLE_DATA, {
          author: {
            avatar: `/api/offers/1520726400000/avatar`
          }
        }));
  });
});

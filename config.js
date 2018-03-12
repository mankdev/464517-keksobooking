require(`dotenv`).config();

module.exports = {
  DB_HOST: process.env.DB_HOST || `localhost:27017/keksobooking`,
  DB_USER: process.env.DB_USER || `root`,
  DB_PASS: process.env.DB_PASS || `root`,

  SERVER_PORT: process.env.SERVER_PORT || `3000`,
  SERVER_HOST: `localhost`,
  SERVER_LOG_LEVEL: `info`
};

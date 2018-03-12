const {SERVER_LOG_LEVEL} = require(`../../config`);
const winston = require(`winston`);

const logger = winston.createLogger({
  level: SERVER_LOG_LEVEL,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: `error.log`, level: `error`}),
    new winston.transports.File({filename: `combined.log`})
  ]
});

if (process.env.NODE_ENV !== `production` && process.env.NODE_ENV !== `test`) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = {
  logger
};

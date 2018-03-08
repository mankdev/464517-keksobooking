const express = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const {generateEntity} = require(`../utils/entities.utils`);

const server = express();
const upload = multer({storage: multer.memoryStorage()});

server.use(express.static(`static`));
server.use(bodyParser.json())


module.exports = {
  server
};

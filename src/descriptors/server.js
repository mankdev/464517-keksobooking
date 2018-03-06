const http = require(`http`);
const url = require(`url`);
const fs = require(`fs`);
const path = require(`path`);
const {promisify} = require(`util`);

const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

const DEFAULT_PORT = 3000;
const STATIC_SOURCE = path.resolve(__dirname, `../../static`);
const DEFAULT_MIME_TYPE = `text/plain`;
const MIME_TYPE_MAP = {
  '.ico': `image/x-icon`,
  '.html': `text/html`,
  '.js': `application/javascript`,
  '.json': `application/json`,
  '.css': `text/css`,
  '.png': `image/png`,
  '.jpg': `image/jpeg`,
  '.gif': `image/gif`,
};

const getFilePath = (pathPart) => {
  if (pathPart === `/`) {
    return path.join(STATIC_SOURCE, `index.html`);
  } else {
    return path.join(STATIC_SOURCE, pathPart);
  }
};

const server = http.createServer((req, res) => {
  const filePath = getFilePath(url.parse(req.url).pathname);

  return exists(filePath)
      .then((isExists) => isExists && readFile(filePath))
      .then((data) => {
        if (data) {
          const ext = path.extname(filePath);
          res.setHeader(`Content-type`, MIME_TYPE_MAP[ext] || DEFAULT_MIME_TYPE);
          res.statusCode = 200;
          res.statusMessage = `OK`;
          res.end(data);
        } else {
          res.writeHead(404, `Not Found`);
          res.end();
        }
      })
      .catch((err) => {
        res.writeHead(500, err.message, {
          'content-type': DEFAULT_MIME_TYPE
        });
        res.end(err.message);
      });
});

function serverHandler() {
  let [port] = process.argv.slice(3);
  port = port || DEFAULT_PORT;
  server.listen(port, (err) => {
    if (err) {
      console.log(`Error happens`, err);
    } else {
      console.log(`Server started in ${port}`);
    }
  });
}

module.exports = {
  aliases: [`--server`, `-s`],
  description: `запускает сервер`,
  execute: serverHandler,
};

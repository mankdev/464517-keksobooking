const {database} = require(`../../database`);
const mongodb = require(`mongodb`);

class ImagesStore {
  async getBucket() {
    if (this._bucket) {
      return this._bucket;
    }
    const dBase = await database;
    if (!this._bucket) {
      this._bucket = new mongodb.GridFSBucket(dBase, {
        chunkSizeBytes: 1024,
        bucketName: `images`
      });
    }
    return this._bucket;
  }

  async get(filename) {
    const bucket = await this.getBucket();
    const results = await (bucket).find({filename}).toArray();
    const entity = results[results.length - 1];
    if (!entity) {
      return void 0;
    }
    return {info: entity, stream: bucket.openDownloadStreamByName(filename)};
  }

  async save(filename, contentType, stream) {
    const bucket = await this.getBucket();
    return new Promise((success, fail) => {
      stream.pipe(bucket.openUploadStream(filename, {contentType})).on(`error`, fail).on(`finish`, success);
    });
  }

}

module.exports = {
  imagesStore: new ImagesStore()
};

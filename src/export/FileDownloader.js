const Utils = require('../common/Utils');

module.exports = class FileDownloader {
  constructor(client, files) {
    this.client = client;
    this.files = files;
  }
  static downloads(client, files) {
    return Utils.executeByChunk(files, 100, (file) => FileDownloader.download(client, file));
  }
  static async download(client, file) {
    return {
      ...file,
      data: (
        await client.file.downloadFile({
          fileKey: file.fileKey,
        })
      ).toString('base64'),
    };
  }
};

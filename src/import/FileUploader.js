module.exports = class FileUploader {
  static async uploads(client, files) {
    return Promise.all(
      files.map((file) => FileUploader.upload(client, file))
    ).then((fileKeys) => {
      const fileKeyMapper = new Map();
      fileKeys.forEach(({ origin, copy }) => {
        fileKeyMapper.set(origin, copy);
      });
      return fileKeyMapper;
    });
  }
  static async upload(client, { fileKey, name, data }) {
    return {
      origin: fileKey,
      copy: (
        await client.file.uploadFile({
          file: {
            name,
            data: Buffer.from(data, 'base64'),
          },
        })
      ).fileKey,
    };
  }
};

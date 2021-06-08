const fs = require('fs');
const { KintoneRestAPIClient } = require('@kintone/rest-api-client');
module.exports = class Client {
  constructor() {
    this.setDefaultConfig(`${__dirname}/../../defaultConfig.json`);
  }
  setDefaultConfig(path) {
    try {
      this.defaultConfig = JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (e) {
      this.defaultConfig = {};
    }
  }
  setOptions(options) {
    this.options = options;
    return this;
  }
  getClient() {
    const clientSettings = {
      baseUrl:
        'https://' + (this.options.domain || this.defaultConfig.domain),
      auth: {
        username: this.options.user || this.defaultConfig.user,
        password: this.options.pass || this.defaultConfig.pass,
      },
      basicAuth: {
        username: this.options.userBasic || this.defaultConfig.userBasic,
        password: this.options.passBasic || this.defaultConfig.passBasic,
      },
    };
    if (this.options.guestSpaceId)
      clientSettings.guestSpaceId = this.options.guestSpaceId;
    return new KintoneRestAPIClient(clientSettings);
  }
};

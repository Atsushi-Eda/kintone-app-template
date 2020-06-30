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
  setCommander(commander) {
    this.commander = commander;
    return this;
  }
  getClient() {
    const options = {
      baseUrl:
        'https://' + (this.commander.domain || this.defaultConfig.domain),
      auth: {
        username: this.commander.user || this.defaultConfig.user,
        password: this.commander.pass || this.defaultConfig.pass,
      },
      basicAuth: {
        username: this.commander.userBasic || this.defaultConfig.userBasic,
        password: this.commander.passBasic || this.defaultConfig.passBasic,
      },
    };
    if (this.commander.guestSpaceId)
      options.guestSpaceId = this.commander.guestSpaceId;
    return new KintoneRestAPIClient(options);
  }
};

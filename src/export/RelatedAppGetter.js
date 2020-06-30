const FieldClassifier = require('../common/FieldClassifier');
const RelatedAppIdConverter = require('./RelatedAppIdConverter');
module.exports = class RelatedAppGetter {
  constructor(client, appIds) {
    this.client = client;
    this.acquiredAppIds = [];
    this.appIds = appIds;
    this.relatedFieldCodes = [];
  }
  async getAllApps() {
    const fields = await this.getFields();
    const relatedFields = this.getRelatedFields(fields);
    this.acquiredAppIds = [...this.appIds];
    this.appIds = this.getAppIds(relatedFields);
    this.relatedFieldCodes.push(
      ...relatedFields.map((app) =>
        app.map((relatedField) => relatedField.code)
      )
    );
    if (this.appIds.length > this.acquiredAppIds.length)
      await this.getAllApps();
    return this;
  }
  getFields() {
    return Promise.all(
      this.appIds
        .slice(this.acquiredAppIds.length)
        .map((appId) => this.client.app.getFormFields({ app: appId }))
    );
  }
  getRelatedFields(apps) {
    return apps.map(({ properties }) =>
      [
        ...Object.values(properties),
        ...Object.values(properties)
          .filter(
            (property) => property.type === FieldClassifier.subtableFieldType
          )
          .map((property) => Object.values(property.fields))
          .flat(),
      ].filter((property) => FieldClassifier.isRelated(property))
    );
  }
  getAppIds(relatedFields) {
    return [
      ...this.appIds,
      ...relatedFields
        .flat()
        .map((relatedField) =>
          RelatedAppIdConverter.getRelatedAppId(relatedField)
        ),
    ].filter((x, i, self) => self.indexOf(x) === i);
  }
};

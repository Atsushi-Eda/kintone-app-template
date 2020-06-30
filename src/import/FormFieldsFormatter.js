const Utils = require('../common/Utils');
const RelatedAppIdConverter = require('./RelatedAppIdConverter');
module.exports = class FormFieldsFormatter {
  constructor() {}
  setAppIds(appIds) {
    this.appIds = appIds;
  }
  formatPresets(presets, copyAppProperties) {
    return Utils.objectKeyMap(
      presets,
      (_, field) =>
        Object.values(copyAppProperties).find(
          (copyAppProperty) => copyAppProperty.type === field.type
        ).code
    );
  }
  formatSubtables(subtables) {
    return Utils.objectValueMap(subtables, (property) => ({
      ...property,
      fields: this.formatRelateds(property.fields, this.appIds),
    }));
  }
  formatRelateds(properties) {
    return RelatedAppIdConverter.indexToId(properties, this.appIds);
  }
};

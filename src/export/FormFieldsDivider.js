const Utils = require('../common/Utils');
const FieldClassifier = require('../common/FieldClassifier');
const RelatedAppIdConverter = require('./RelatedAppIdConverter');
module.exports = class FormFieldsDivider {
  constructor({ properties }, appIds) {
    this.properties = properties;
    this.appIds = appIds;
  }
  divide() {
    return {
      presets: this.getPresets(),
      basics: this.getBasics(),
      subtables: this.getSubtables(),
      lookups: this.getLookups(),
      referenceTables: this.getReferenceTables(),
    };
  }
  propertiesFilter(classifier) {
    return Utils.objectValueFilter(this.properties, classifier);
  }
  getPresets() {
    return this.propertiesFilter(FieldClassifier.isPreset);
  }
  getBasics() {
    return this.propertiesFilter(FieldClassifier.isBasic);
  }
  getSubtables() {
    return Utils.objectValueMap(
      this.propertiesFilter(FieldClassifier.isSubtable),
      (property) => ({
        ...property,
        fields: RelatedAppIdConverter.idToIndex(property.fields, this.appIds),
      })
    );
  }
  getLookups() {
    return RelatedAppIdConverter.idToIndex(
      this.propertiesFilter(FieldClassifier.isLookup),
      this.appIds
    );
  }
  getReferenceTables() {
    return RelatedAppIdConverter.idToIndex(
      this.propertiesFilter(FieldClassifier.isReferenceTable),
      this.appIds
    );
  }
};

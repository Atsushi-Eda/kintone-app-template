const Utils = require('../common/Utils');
const FieldClassifier = require('../common/FieldClassifier');
module.exports = class RelatedAppIdConverter {
  static getRelatedAppIndex(relatedField) {
    return relatedField[FieldClassifier.getRelatedFieldKey(relatedField)]
      .relatedApp.appIndex;
  }
  static getRelatedAppId(relatedField, appIds) {
    return appIds[RelatedAppIdConverter.getRelatedAppIndex(relatedField)];
  }
  static indexToId(properties, appIds) {
    return Utils.objectValueMap(properties, (property) => {
      if (!FieldClassifier.isRelated(property)) return property;
      return {
        ...property,
        [FieldClassifier.getRelatedFieldKey(property)]: {
          ...property[FieldClassifier.getRelatedFieldKey(property)],
          relatedApp: {
            app: RelatedAppIdConverter.getRelatedAppId(property, appIds),
          },
        },
      };
    });
  }
};

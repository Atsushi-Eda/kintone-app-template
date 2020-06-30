const Utils = require('../common/Utils');
const FieldClassifier = require('../common/FieldClassifier');
module.exports = class RelatedAppIdConverter {
  static getRelatedAppId(relatedField) {
    return relatedField[FieldClassifier.getRelatedFieldKey(relatedField)]
      .relatedApp.app;
  }
  static getRelatedAppIndex(relatedField, appIds) {
    return appIds.indexOf(RelatedAppIdConverter.getRelatedAppId(relatedField));
  }
  static idToIndex(properties, appIds) {
    return Utils.objectValueMap(properties, (property) => {
      if (!FieldClassifier.isRelated(property)) return property;
      return {
        ...property,
        [FieldClassifier.getRelatedFieldKey(property)]: {
          ...property[FieldClassifier.getRelatedFieldKey(property)],
          relatedApp: {
            appIndex: RelatedAppIdConverter.getRelatedAppIndex(
              property,
              appIds
            ),
          },
        },
      };
    });
  }
};

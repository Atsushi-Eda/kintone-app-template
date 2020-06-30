module.exports = class FieldClassifier {
  static presetFieldTypes = [
    'RECORD_NUMBER',
    '__ID__',
    '__REVISION__',
    'CREATOR',
    'MODIFIER',
    'CREATED_TIME',
    'UPDATED_TIME',
    'CATEGORY',
    'STATUS',
    'STATUS_ASSIGNEE',
  ];
  static subtableFieldType = 'SUBTABLE';
  static lookupFieldKey = 'lookup';
  static referenceTableFieldKey = 'referenceTable';

  static isPreset(property) {
    return FieldClassifier.presetFieldTypes.includes(property.type);
  }
  static isSubtable(property) {
    return FieldClassifier.subtableFieldType === property.type;
  }
  static isLookup(property) {
    return property[FieldClassifier.lookupFieldKey];
  }
  static isReferenceTable(property) {
    return property[FieldClassifier.referenceTableFieldKey];
  }
  static isRelated(property) {
    return (
      FieldClassifier.isLookup(property) ||
      FieldClassifier.isReferenceTable(property)
    );
  }
  static isBasic(property) {
    return (
      !FieldClassifier.isPreset(property) &&
      !FieldClassifier.isSubtable(property) &&
      !FieldClassifier.isRelated(property)
    );
  }
  static getRelatedFieldKey(property) {
    if (FieldClassifier.isLookup(property))
      return FieldClassifier.lookupFieldKey;
    if (FieldClassifier.isReferenceTable(property))
      return FieldClassifier.referenceTableFieldKey;
    return null;
  }
};

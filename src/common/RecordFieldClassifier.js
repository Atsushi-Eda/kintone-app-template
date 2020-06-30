module.exports = class RecordFieldClassifier {
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
  static userSelectFieldTypes = [
    'USER_SELECT',
    'ORGANIZATION_SELECT',
    'GROUP_SELECT',
  ];
  static subtableFieldType = 'SUBTABLE';
  static fileFieldType = 'FILE';

  static isPreset(fieldEntry) {
    const field = Array.isArray(fieldEntry) ? fieldEntry[1] : fieldEntry;
    return RecordFieldClassifier.presetFieldTypes.includes(field.type);
  }
  static isUserSelect(fieldEntry) {
    const field = Array.isArray(fieldEntry) ? fieldEntry[1] : fieldEntry;
    return RecordFieldClassifier.userSelectFieldTypes.includes(field.type);
  }
  static isSubtable(fieldEntry) {
    const field = Array.isArray(fieldEntry) ? fieldEntry[1] : fieldEntry;
    return RecordFieldClassifier.subtableFieldType === field.type;
  }
  static isFile(fieldEntry) {
    const field = Array.isArray(fieldEntry) ? fieldEntry[1] : fieldEntry;
    return RecordFieldClassifier.fileFieldType === field.type;
  }
  static isRelated(fieldEntry, relatedFieldCodes) {
    const fieldCode = Array.isArray(fieldEntry) ? fieldEntry[0] : fieldEntry;
    return relatedFieldCodes.includes(fieldCode);
  }
  static isBasic(fieldEntry, relatedFieldCodes) {
    return (
      !RecordFieldClassifier.isPreset(fieldEntry) &&
      !RecordFieldClassifier.isUserSelect(fieldEntry) &&
      !RecordFieldClassifier.isSubtable(fieldEntry) &&
      !RecordFieldClassifier.isRelated(fieldEntry, relatedFieldCodes)
    );
  }
  static isPost(fieldEntry, relatedFieldCodes) {
    return RecordFieldClassifier.isBasic(fieldEntry, relatedFieldCodes);
  }
  static isPut(fieldEntry, relatedFieldCodes) {
    return (
      RecordFieldClassifier.isSubtable(fieldEntry) ||
      RecordFieldClassifier.isRelated(fieldEntry, relatedFieldCodes)
    );
  }
};

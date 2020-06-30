const Utils = require('../common/Utils');
const RecordFieldClassifier = require('../common/RecordFieldClassifier');
module.exports = class FileFormatter {
  constructor(fileKeyMapper) {
    this.fileKeyMapper = fileKeyMapper;
  }
  static identifier = 'FILE';
  formatAppSettings(appSettings) {
    return {
      ...appSettings,
      icon: this.formatIcon(appSettings.icon),
    };
  }
  formatIcon(icon) {
    if (icon.type !== FileFormatter.identifier) return icon;
    return {
      ...icon,
      file: {
        ...icon.file,
        fileKey: this.fileKeyMapper.get(icon.file.fileKey),
      },
    };
  }
  formatAppCustomize(appCustomize) {
    return {
      ...appCustomize,
      desktop: {
        js: this.formatAppCustomizeUnit(appCustomize.desktop.js),
        css: this.formatAppCustomizeUnit(appCustomize.desktop.css),
      },
      mobile: {
        js: this.formatAppCustomizeUnit(appCustomize.mobile.js),
        css: this.formatAppCustomizeUnit(appCustomize.mobile.css),
      },
    };
  }
  formatAppCustomizeUnit(appCustomizeFiles) {
    return appCustomizeFiles.map((appCustomizeFile) => {
      if (appCustomizeFile.type !== FileFormatter.identifier)
        return appCustomizeFile;
      return {
        ...appCustomizeFile,
        file: {
          ...appCustomizeFile.file,
          fileKey: this.fileKeyMapper.get(appCustomizeFile.file.fileKey),
        },
      };
    });
  }
  formatRecordsPosts(posts) {
    return posts.map((record) =>
      Utils.objectValueMap(record, (field) => {
        if (!RecordFieldClassifier.isFile(field)) return field;
        return {
          ...field,
          value: field.value.map(({ fileKey }) => ({
            fileKey: this.fileKeyMapper.get(fileKey),
          })),
        };
      })
    );
  }
  formatRecordsPuts(puts) {
    return puts.map((record) => ({
      id: record.id,
      record: Utils.objectValueMap(record.record, (field) => {
        if (!RecordFieldClassifier.isSubtable(field)) return field;
        return {
          ...field,
          value: field.value.map((row) => ({
            value: Utils.objectValueMap(row.value, (column) => {
              if (!RecordFieldClassifier.isFile(column)) return column;
              return {
                ...column,
                value: column.value.map(({ fileKey }) => ({
                  fileKey: this.fileKeyMapper.get(fileKey),
                })),
              };
            }),
          })),
        };
      }),
    }));
  }
};

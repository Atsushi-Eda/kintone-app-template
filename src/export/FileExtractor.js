const RecordFieldClassifier = require('../common/RecordFieldClassifier');
module.exports = class FileExtractor {
  static identifier = 'FILE';
  static extract(apps) {
    return apps
      .map((app) => [
        ...FileExtractor.extractFromIcon(app.appSettings.icon),
        ...FileExtractor.extractFromAppCustomize(app.appCustomize),
        ...FileExtractor.extractFromRecords(app.records),
      ])
      .flat();
  }
  static extractFromIcon(icon) {
    return icon.type === FileExtractor.identifier ? [icon.file] : [];
  }
  static extractFromAppCustomize(appCustomize) {
    return [
      ...FileExtractor.extractFromAppCustomizeUnit(appCustomize.desktop.js),
      ...FileExtractor.extractFromAppCustomizeUnit(appCustomize.desktop.css),
      ...FileExtractor.extractFromAppCustomizeUnit(appCustomize.mobile.js),
      ...FileExtractor.extractFromAppCustomizeUnit(appCustomize.mobile.css),
    ];
  }
  static extractFromAppCustomizeUnit(appCustomizeFiles) {
    return appCustomizeFiles
      .filter(({ type }) => type === FileExtractor.identifier)
      .map(({ file }) => file);
  }
  static extractFromRecords(records) {
    return [
      ...FileExtractor.extractFromRecordsPosts(records.posts),
      ...FileExtractor.extractFromRecordsPuts(records.puts),
    ];
  }
  static extractFromRecordsPosts(posts) {
    return posts
      .map((record) =>
        Object.entries(record)
          .filter(RecordFieldClassifier.isFile)
          .map(([_, { value }]) => value)
      )
      .flat(2);
  }
  static extractFromRecordsPuts(puts) {
    return puts
      .map((record) =>
        Object.entries(record.record)
          .filter(RecordFieldClassifier.isSubtable)
          .map(([_, { value }]) =>
            value.map((row) =>
              Object.entries(row.value)
                .filter(RecordFieldClassifier.isFile)
                .map(([_, { value }]) => value)
            )
          )
      )
      .flat(4);
  }
};

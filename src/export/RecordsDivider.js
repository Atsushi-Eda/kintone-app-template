const Utils = require('../common/Utils');
const RecordFieldClassifier = require('../common/RecordFieldClassifier');
module.exports = class RecordsDivider {
  constructor(records, relatedFieldCodes) {
    this.records = records;
    this.relatedFieldCodes = relatedFieldCodes;
  }
  divide() {
    this.records = this.addEmptyRecords(this.addId(this.records));
    return {
      posts: this.getPosts(),
      puts: this.getPuts(),
      deletes: this.getDeletes(),
    };
  }
  getId(record) {
    return Number(record.$id.value);
  }
  addId(records) {
    return records.map((record) => ({
      id: this.getId(record),
      record,
    }));
  }
  addEmptyRecords(records) {
    return records.reduce((records, record) => {
      while (true) {
        const id = records.length ? records.slice(-1)[0].id + 1 : 1;
        if (id === record.id) break;
        records.push({ id, record: {}, deleted: true });
      }
      records.push(record);
      return records;
    }, []);
  }
  recordsFilter(classifier) {
    return this.records.map((record) => ({
      ...record,
      record: Utils.objectFilter(record.record, (fieldEntry) =>
        classifier(fieldEntry, this.relatedFieldCodes)
      ),
    }));
  }
  getPosts() {
    return this.recordsFilter(RecordFieldClassifier.isPost).map(
      (record) => record.record
    );
  }
  getPuts() {
    return this.recordsFilter(RecordFieldClassifier.isPut).filter(
      (record) => !record.deleted
    );
  }
  getDeletes() {
    return this.records
      .filter((record) => record.deleted)
      .map(({ id }) => ({ id }));
  }
};

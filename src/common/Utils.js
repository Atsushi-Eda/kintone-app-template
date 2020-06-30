module.exports = class Utils {
  static objectMap(obj, fun) {
    return Object.fromEntries(Object.entries(obj).map(fun));
  }
  static objectKeyMap(obj, fun) {
    return Utils.objectMap(obj, ([key, value]) => [fun(key, value), value]);
  }
  static objectValueMap(obj, fun) {
    return Utils.objectMap(obj, ([key, value]) => [key, fun(value, key)]);
  }
  static objectFilter(obj, fun) {
    return Object.fromEntries(Object.entries(obj).filter(fun));
  }
  static objectKeyFilter(obj, fun) {
    return Utils.objectFilter(obj, ([key, value]) => fun(key));
  }
  static objectValueFilter(obj, fun) {
    return Utils.objectFilter(obj, ([key, value]) => fun(value));
  }
};

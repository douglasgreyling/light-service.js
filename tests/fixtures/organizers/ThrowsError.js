const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const ThrowsErrorAction = require("../actions/ThrowsError.js");

module.exports = class ThrowsError extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(AddsOne, ThrowsErrorAction);
  }
};

const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");

module.exports = class Valid extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(AddsOne, AddsOne);
  }
}

const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const SkipsContext = require("../actions/SkipsContext.js");

module.exports = class SkipActions extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(AddsOne, SkipsContext, AddsOne);
  }
}

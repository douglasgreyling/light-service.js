const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const SkipRemainingAction = require("../actions/SkipRemaining.js");

module.exports = class SkipRemaining extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(AddsOne, SkipRemainingAction, AddsOne);
  }
}

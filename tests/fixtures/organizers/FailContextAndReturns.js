const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const FailsContextAndReturns = require("../actions/FailsContextAndReturns.js");

module.exports = class FailContext extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      FailsContextAndReturns,
      AddsOne,
      AddsOne
    );
  }
}

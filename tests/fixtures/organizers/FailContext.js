const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const FailsContext = require("../actions/FailsContext.js");

module.exports = class FailContext extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      FailsContext,
      AddsOne,
      AddsOne
    );
  }
}

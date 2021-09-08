const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const FailsContextAndRollsbackWithNoHandler = require("../actions/FailsContextAndRollsbackWithNoHandler.js");

module.exports = class RollbackWithNoHandler extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      AddsOne,
      FailsContextAndRollsbackWithNoHandler
    );
  }
}

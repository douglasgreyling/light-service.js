const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const FailsContextAndRollsback = require("../actions/FailsContextAndRollsback.js");

module.exports = class Rollback extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      AddsOne,
      FailsContextAndRollsback
    );
  }
}

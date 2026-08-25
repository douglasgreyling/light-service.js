const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const FailsContextAndRollsback = require("../actions/FailsContextAndRollsback.js");

module.exports = class RollbackFromFirstAction extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(FailsContextAndRollsback, AddsOne);
  }
};

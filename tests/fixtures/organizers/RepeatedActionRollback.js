const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const FailsContextAndRollsbackOnSecondRun = require("../actions/FailsContextAndRollsbackOnSecondRun.js");

// The same action class appears twice; only the second occurrence fails.
module.exports = class RepeatedActionRollback extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      FailsContextAndRollsbackOnSecondRun,
      AddsOne,
      FailsContextAndRollsbackOnSecondRun,
    );
  }
};

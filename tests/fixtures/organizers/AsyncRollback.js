const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const FailsContextAndRollsbackAsync = require("../actions/FailsContextAndRollsbackAsync.js");

module.exports = class AsyncRollback extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      AddsOne,
      FailsContextAndRollsbackAsync,
    );
  }
};

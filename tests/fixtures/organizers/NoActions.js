const Organizer = require("../../../src/Organizer.js");

module.exports = class NoActions extends Organizer {
  static call(number) {
    return this.with({ number }).reduce();
  }
};

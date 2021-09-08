const Organizer = require("../../../src/Organizer.js");
const AddsOne = require("../actions/Valid.js");
const Alias = require("../actions/Alias.js");

module.exports = class AliasOrganizer extends Organizer {
  aliases = { number: "num" };

  static call(number) {
    return this.with({ number }).reduce(AddsOne, Alias);
  }
}

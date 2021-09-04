import Organizer from "../../../src/Organizer.js";

import AddsOne from "../actions/Valid.js";
import Alias from "../actions/Alias.js";

export default class AliasOrganizer extends Organizer {
  aliases = { number: "num" };

  static call(number) {
    return this.with({ number }).reduce(AddsOne, Alias);
  }
}

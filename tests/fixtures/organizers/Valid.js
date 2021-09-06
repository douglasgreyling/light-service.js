import Organizer from "../../../src/Organizer.js";

import AddsOne from "../actions/Valid.js";

export default class Valid extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(AddsOne, AddsOne);
  }
}

import Organizer from "../../../src/Organizer.js";

import AddsOne from "../actions/Valid.js";
import SkipRemainingAction from "../actions/SkipRemaining.js";

export default class SkipRemaining extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(AddsOne, SkipRemainingAction, AddsOne);
  }
}

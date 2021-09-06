import Organizer from "../../../src/Organizer.js";

import AddsOne from "../actions/Valid.js";
import SkipsContext from "../actions/SkipsContext.js";

export default class SkipActions extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(AddsOne, SkipsContext, AddsOne);
  }
}

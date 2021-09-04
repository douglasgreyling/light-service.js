import Organizer from "../../../src/Organizer.js";

import AddsOne from "../actions/Valid.js";
import FailsContext from "../actions/FailsContext.js";

export default class FailContext extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      FailsContext,
      AddsOne,
      AddsOne
    );
  }
}

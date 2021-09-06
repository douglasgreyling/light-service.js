import Organizer from "../../../src/Organizer.js";

import AddsOne from "../actions/Valid.js";
import FailsContextAndReturns from "../actions/FailsContextAndReturns.js";

export default class FailContext extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      FailsContextAndReturns,
      AddsOne,
      AddsOne
    );
  }
}

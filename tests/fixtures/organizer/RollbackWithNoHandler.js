import Organizer from "../../../src/Organizer.js";

import AddsOne from "../actions/Valid.js";
import FailsContextAndRollsbackWithNoHandler from "../actions/FailsContextAndRollsbackWithNoHandler.js";

export default class RollbackWithNoHandler extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      AddsOne,
      FailsContextAndRollsbackWithNoHandler
    );
  }
}

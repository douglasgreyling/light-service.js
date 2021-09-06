import Organizer from "../../../src/Organizer.js";

import AddsOne from "../actions/Valid.js";
import FailsContextAndRollsback from "../actions/FailsContextAndRollsback.js";

export default class Rollback extends Organizer {
  static call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      AddsOne,
      FailsContextAndRollsback
    );
  }
}

import Organizer from "../../../src/Organizer.js";

import Hooks from "../actions/Hooks.js";

export default class BeforeHooks extends Organizer {
  beforeEach(context) {
    context.order.push("before");
  }

  static call(order) {
    return this.with({ order }).reduce(Hooks);
  }
}

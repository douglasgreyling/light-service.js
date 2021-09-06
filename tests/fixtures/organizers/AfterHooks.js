import Organizer from "../../../src/Organizer.js";

import Hooks from "../actions/Hooks.js";

export default class AfterHooks extends Organizer {
  afterEach(context) {
    context.order.push("after");
  }

  static call(order) {
    return this.with({ order }).reduce(Hooks);
  }
}

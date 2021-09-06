import Organizer from "../../../src/Organizer.js";

import Hooks from "../actions/Hooks.js";

export default class AroundHooks extends Organizer {
  aroundEach(context) {
    context.order.push("around");
  }

  static call(order) {
    return this.with({ order }).reduce(Hooks);
  }
}

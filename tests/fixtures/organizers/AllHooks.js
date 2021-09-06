import Organizer from "../../../src/Organizer.js";

import Hooks from "../actions/Hooks.js";

export default class AllHooks extends Organizer {
  aroundEach(context) {
    context.order.push("around");
  }

  beforeEach(context) {
    context.order.push("before");
  }

  afterEach(context) {
    context.order.push("after");
  }

  static call(order) {
    return this.with({ order }).reduce(Hooks);
  }
}

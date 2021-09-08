const Organizer = require("../../../src/Organizer.js");
const Hooks = require("../actions/Hooks.js");

module.exports = class AllHooks extends Organizer {
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

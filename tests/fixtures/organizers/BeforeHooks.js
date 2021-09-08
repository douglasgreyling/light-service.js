const Organizer = require("../../../src/Organizer.js");
const Hooks = require("../actions/Hooks.js");

module.exports = class BeforeHooks extends Organizer {
  beforeEach(context) {
    context.order.push("before");
  }

  static call(order) {
    return this.with({ order }).reduce(Hooks);
  }
}

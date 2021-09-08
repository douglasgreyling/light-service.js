const Organizer = require("../../../src/Organizer.js");
const Hooks = require("../actions/Hooks.js");

module.exports = class AfterHooks extends Organizer {
  afterEach(context) {
    context.order.push("after");
  }

  static call(order) {
    return this.with({ order }).reduce(Hooks);
  }
}

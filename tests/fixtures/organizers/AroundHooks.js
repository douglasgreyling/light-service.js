const Organizer = require("../../../src/Organizer.js");
const Hooks = require("../actions/Hooks.js");

module.exports = class AroundHooks extends Organizer {
  aroundEach(context) {
    context.order.push("around");
  }

  static call(order) {
    return this.with({ order }).reduce(Hooks);
  }
}

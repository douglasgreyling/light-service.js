const Organizer = require("../../../src/Organizer.js");
const Hooks = require("../actions/Hooks.js");

module.exports = class HookContext extends Organizer {
  label = "the organizer";

  beforeEach(context) {
    context.hookThis = this.label;
  }

  static call(order) {
    return this.with({ order }).reduce(Hooks);
  }
};

const Organizer = require("../../../src/Organizer.js");
const SkipRemaining = require("../actions/SkipRemaining.js");
const Hooks = require("../actions/Hooks.js");

// SkipRemaining stops the chain, so the second action never runs and must not
// pick up any hooks.
module.exports = class HooksSkippedAction extends Organizer {
  aroundEach(context) {
    context.order.push("around");
  }

  afterEach(context) {
    context.order.push("after");
  }

  static call(order) {
    return this.with({ order, number: 1 }).reduce(SkipRemaining, Hooks);
  }
};

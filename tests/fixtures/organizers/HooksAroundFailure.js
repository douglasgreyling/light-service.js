const Organizer = require("../../../src/Organizer.js");
const FailsContextAndReturns = require("../actions/FailsContextAndReturns.js");

module.exports = class HooksAroundFailure extends Organizer {
  aroundEach(context) {
    context.order.push("around");
  }

  afterEach(context) {
    context.order.push("after");
  }

  static call(order) {
    return this.with({ order, number: 1 }).reduce(FailsContextAndReturns);
  }
};

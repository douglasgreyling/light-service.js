const Action = require("../../../src/Action.js");

module.exports = class SkipRemaining extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
    this.skipRemaining();
  }
}

const Action = require("../../../src/Action.js");

module.exports = class SkipsContext extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
    this.nextContext();
    this.context.number = number + 1;
  }
}

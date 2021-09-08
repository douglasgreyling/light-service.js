const Action = require("../../../src/Action.js");

module.exports = class FailsContextAndReturns extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.failAndReturn("some message", { errorCode: 123 });
    this.context.number = number + 1;
  }
}

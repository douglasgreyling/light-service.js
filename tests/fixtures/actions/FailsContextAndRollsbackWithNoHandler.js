const Action = require("../../../src/Action.js");

module.exports = class FailsContextAndRollsback extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
    this.failWithRollback("some message", { errorCode: 123 });
  }
}

const Action = require("../../../src/Action.js");

module.exports = class FailsContextAndRollsbackOnSecondRun extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
    this.context.runs = (this.context.runs || 0) + 1;

    if (this.context.runs === 2) this.failWithRollback("some message");
  }

  rolledBack({ number }) {
    this.context.number = number - 1;
  }
};

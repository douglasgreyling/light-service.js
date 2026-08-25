const Action = require("../../../src/Action.js");

module.exports = class FailsContextAndRollsbackAsync extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
    this.failWithRollback("some message");
  }

  async rolledBack(context) {
    await new Promise((resolve) => setTimeout(resolve, 20));

    context.asyncRollbackFinished = true;
  }
};

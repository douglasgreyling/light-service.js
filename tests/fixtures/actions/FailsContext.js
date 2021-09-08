const Action = require("../../../src/Action.js");

module.exports = class FailsContext extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.fail("some message", { errorCode: 123 });
    this.context.number = number + 1;
  }
}

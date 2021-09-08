const Action = require("../../../src/Action.js");

module.exports = class MissingPromise extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    delete this.context.number;
    this.context.newNumber = number + 1;
  }
}

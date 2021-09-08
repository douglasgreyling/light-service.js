const Action = require("../../../src/Action.js");

module.exports = class Valid extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
  }

  rolledBack({ number }) {
    this.context.number = number - 1;
  }
}

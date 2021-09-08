const Action = require("../../../src/Action.js");

module.exports = class ExpectsObject extends Action {
  expects = { fields: ["number"] };
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
  }
};

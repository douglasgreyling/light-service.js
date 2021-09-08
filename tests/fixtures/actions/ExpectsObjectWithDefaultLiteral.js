const Action = require("../../../src/Action.js");

module.exports = class ExpectsObjectWithDefaultLiteral extends Action {
  expects = { fields: ["number"], defaults: { number: 1 } };
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
  }
}

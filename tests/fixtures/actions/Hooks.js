const Action = require("../../../src/Action.js");

module.exports = class Hooks extends Action {
  expects = ["order"];
  promises = ["order"];

  executed() {
    this.context.order.push("executed");
  }
}

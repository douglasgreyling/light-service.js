const Action = require("../../../src/Action.js");

module.exports = class RecordsRollback extends Action {
  expects = ["order"];
  promises = ["order"];

  executed(context) {
    context.order.push("executed");
  }

  rolledBack(context) {
    context.order.push("rolledBack");
  }
};

const Action = require("../../../src/Action.js");

module.exports = class Alias extends Action {
  expects = ["num"];
  promises = ["num"];

  executed({ num }) {
    this.context.num = num + 1;
  }

  rolledBack({ num }) {
    this.context.num = num - 1;
  }
};

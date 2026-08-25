const Action = require("../../../src/Action.js");

module.exports = class ThrowsError extends Action {
  executed() {
    throw new Error("something unexpected happened");
  }
};

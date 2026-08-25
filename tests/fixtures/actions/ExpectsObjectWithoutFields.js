const Action = require("../../../src/Action.js");

module.exports = class ExpectsObjectWithoutFields extends Action {
  expects = { defaults: { number: 1 } };

  executed() {}
};

const Action = require("../../../src/Action.js");

function resolveAfter1Second(value, duration = 5) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, duration);
  });
}

module.exports = class ExpectsObjectWithDefaultFunction extends Action {
  expects = {
    fields: ["number"],
    defaults: { number: async () => resolveAfter1Second(1) },
  };
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
  }
}

const Organizer = require("../../../src/Organizer.js");
const RecordsRollback = require("../actions/RecordsRollback.js");

module.exports = class RollbackFromHook extends Organizer {
  beforeEach(context) {
    context.failWithRollback("failed before the action ran");
  }

  static call(order) {
    return this.with({ order }).reduce(RecordsRollback);
  }
};

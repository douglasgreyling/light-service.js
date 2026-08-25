const SkipActionError = require("./errors/SkipActionError.js");
const RollbackError = require("./errors/RollbackError.js");

module.exports = class ActionExecutionStep {
  static create(action, fn, { isHook = false, marksExecution = false } = {}) {
    return async (context) => {
      try {
        if (isHook ? action.__ran : this.shouldExecuteStep(context)) {
          if (marksExecution) action.__executedRan = true;

          await fn(context);
        }
      } catch (err) {
        if (err instanceof SkipActionError) return;

        if (err instanceof RollbackError) {
          if (action.__executedRan && action.rolledBack)
            await action.rolledBack(context);

          return;
        }

        throw err;
      }
    };
  }

  static shouldExecuteStep(context) {
    return (
      context.success() &&
      !context.__skipAction &&
      !context.__skipRemaining &&
      !context.__rollback
    );
  }
};

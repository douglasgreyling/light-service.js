module.exports = class ActionExecutionStep {
  static create(action, fn) {
    return async (context) => {
      try {
        if (this.shouldExecuteStep(context)) await fn(context);
      } catch (err) {
        switch (err.constructor.name) {
          case "SkipActionError":
            break;
          case "RollbackError":
            if (action.rolledBack) action.rolledBack(context);
            break;
          default:
            throw err;
        }
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
}

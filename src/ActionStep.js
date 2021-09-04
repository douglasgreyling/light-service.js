export default class ActionStep {
  static create(action, fn) {
    return async (context) => {
      try {
        if (
          context.success() &&
          !context.__skipAction &&
          !context.__skipRemaining &&
          !context.__rollback
        )
          await fn(context);
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
}

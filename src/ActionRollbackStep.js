module.exports = class ActionRollbackStep {
  static create(fn) {
    return async (context) => await fn(context);
  }
}

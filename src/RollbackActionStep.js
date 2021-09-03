export default class RollbackActionStep {
  static create(fn) {
    return async (context) => await fn(context);
  }
}

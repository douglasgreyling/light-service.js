module.exports = class RollbackError extends Error {
  constructor(action = undefined) {
    super();
    this.action = action;
  }
}

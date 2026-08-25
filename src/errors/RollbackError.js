module.exports = class RollbackError extends Error {
  constructor(action = undefined) {
    super();
    this.action = action;
    // Stamped by the organizer, the only place that knows where in the chain
    // the action ran.
    this.index = undefined;
  }
};

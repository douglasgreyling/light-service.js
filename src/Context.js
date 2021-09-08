const SkipActionError = require("./errors/SkipActionError.js");
const RollbackError = require("./errors/RollbackError.js");

const CLEANABLE_ACTION_CONTEXT_KEYS = ["__skipAction", "__rollback"];
const CLEANABLE_ORGANIZER_CONTEXT_KEYS = [
  "__skipRemaining",
  "__rollback",
  "__currentOrganizer",
  "__currentAction",
];

class Context {
  constructor(args) {
    this.__success = true;
    Object.assign(this, args);
  }

  success() {
    return this.__success;
  }

  failure() {
    return !this.success();
  }

  message() {
    return this.__message;
  }

  currentOrganizer() {
    return this.__currentOrganizer;
  }

  currentAction() {
    return this.__currentAction;
  }

  errorCode() {
    return this.__errorCode;
  }

  shouldRollback() {
    return this.currentOrganizer() !== undefined && this.__rollback;
  }

  fail(message = undefined, { errorCode = undefined } = {}) {
    if (message) {
      this.__message = message;
    }

    if (errorCode) {
      this.__errorCode = errorCode;
    }

    this.__success = false;
  }

  nextContext() {
    this.__skipAction = true;
    throw new SkipActionError();
  }

  failAndReturn(message, opts) {
    this.fail(message, opts);
    this.nextContext();
  }

  skipRemaining() {
    this.__skipRemaining = true;
  }

  failWithRollback(message, opts) {
    this.fail(message, opts);
    this.__rollback = true;

    throw new RollbackError();
  }

  cleanActionContext() {
    CLEANABLE_ACTION_CONTEXT_KEYS.forEach((key) => delete this[key]);

    return this;
  }

  cleanOrganizerContext() {
    CLEANABLE_ORGANIZER_CONTEXT_KEYS.forEach((key) => delete this[key]);

    return this;
  }

  registerAliases(aliases) {
    for (const [actualKey, aliasKey] of Object.entries(aliases))
      this.__mapAlias(actualKey, aliasKey);
  }

  // private

  __mapAlias(actualKey, aliasKey) {
    Object.defineProperty(this, aliasKey, {
      enumerable: true,
      configurable: true,
      get() {
        return this[actualKey];
      },
      set(value) {
        this[actualKey] = value;
      },
    });
  }
}

module.exports = {
  CLEANABLE_ACTION_CONTEXT_KEYS,
  CLEANABLE_ORGANIZER_CONTEXT_KEYS,
  Context
}
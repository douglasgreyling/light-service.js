import SkipActionError from "./errors/SkipActionError.js";
import RollbackError from "./errors/RollbackError.js";

export default class Context {
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

  errorCode() {
    return this.__errorCode;
  }

  fail(message = undefined, { errorCode = undefined }) {
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
    delete this.__skipAction;
    delete this.__rollback;

    return this;
  }

  cleanOrganizerContext() {
    delete this.__skipRemaining;
    delete this.__rollback;
    delete this.__currentOrganizer;
    delete this.__currentAction;
  }

  registerAliases(aliases) {
    for (const actualKey in aliases) {
      Object.defineProperty(this, aliases[actualKey], {
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

  currentOrganizer() {
    return this.__currentOrganizer;
  }

  currentAction() {
    return this.__currentAction;
  }

  shouldRollback() {
    return this.currentOrganizer() !== undefined && this.__rollback;
  }
}

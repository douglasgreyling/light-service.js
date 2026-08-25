const pipe = require("./utils/pipe.js");
const RollbackError = require("./errors/RollbackError.js");
const { Context } = require("./Context.js");

module.exports = class Organizer {
  static with(context = {}) {
    return new this(context);
  }

  constructor(context) {
    this.context = context instanceof Context ? context : new Context(context);
    this.aliases = {};
  }

  async reduce(...actions) {
    if (actions.length === 0) return this.context.cleanOrganizerContext();

    const pipeline = pipe(...this.constructor.__executeFns(actions, this));

    try {
      this.context = await pipeline(this.context);
    } catch (err) {
      if (err instanceof RollbackError) {
        await this.reduceRollback(actions, err.action, err.index);
      } else {
        throw err;
      }
    }

    this.context.cleanOrganizerContext();

    return this.context;
  }

  async reduceRollback(actions, failedAction, failedIndex) {
    const fns = this.constructor.__rollbackFns(actions, failedIndex, this);

    if (fns.length === 0) {
      this.context = failedAction.context;

      return;
    }

    this.context = await pipe(...fns)(failedAction.context);
  }

  getHooks() {
    let hooks = {};

    if (this.beforeEach) hooks.beforeEach = this.beforeEach.bind(this);
    if (this.afterEach) hooks.afterEach = this.afterEach.bind(this);
    if (this.aroundEach) hooks.aroundEach = this.aroundEach.bind(this);

    return hooks;
  }

  // private

  static __metadataFor(action, organizer) {
    return {
      __currentOrganizer: this.__nameOf(organizer.constructor),
      __currentAction: this.__nameOf(action),
    };
  }

  static __nameOf(klass) {
    return klass.displayName || klass.name;
  }

  static __executeFns(actions, organizer) {
    return actions.map((action, index) => async (ctx) => {
      try {
        return await action.execute(
          Object.assign(ctx, this.__metadataFor(action, organizer)),
          {
            aliases: organizer.aliases,
            hooks: organizer.getHooks(),
          },
        );
      } catch (err) {
        if (err instanceof RollbackError) err.index = index;

        throw err;
      }
    });
  }

  static __rollbackFns(actions, failedIndex, organizer) {
    let rollbackActions = actions.slice(0, failedIndex).reverse();

    return rollbackActions.map(
      (action) => async (ctx) =>
        action.rollBack(
          Object.assign(ctx, this.__metadataFor(action, organizer)),
          organizer.aliases,
        ),
    );
  }
};

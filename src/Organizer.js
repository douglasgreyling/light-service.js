import pPipe from "p-pipe";

export default class Organizer {
  static with(context = {}) {
    return new this(context);
  }

  constructor(context) {
    this.context = context;
    this.aliases = [];
  }

  async reduce(...actions) {
    const pipeline = pPipe(...this.constructor.__executeFns(actions, this));

    try {
      this.context = await pipeline(this.context);
    } catch (err) {
      if (err.constructor.name === "RollbackError") {
        await this.reduceRollback(actions, err.action);
      } else {
        throw err;
      }
    }

    this.context.cleanOrganizerContext();

    return this.context;
  }

  async reduceRollback(actions, failedAction) {
    const pipeline = pPipe(
      ...this.constructor.__rollbackFns(actions, failedAction, this)
    );

    this.context = await pipeline(failedAction.context);
  }

  getHooks() {
    let hooks = {};

    if (this.beforeEach) hooks.beforeEach = this.beforeEach;
    if (this.afterEach) hooks.afterEach = this.afterEach;
    if (this.aroundEach) hooks.aroundEach = this.aroundEach;

    return hooks;
  }

  // private

  static __executeFns(actions, organizer) {
    return actions.map((action) => async (ctx) => {
      let organizerContextMetadata = {
        __currentOrganizer: organizer.constructor.name,
        __currentAction: action.name,
      };

      return action.execute(Object.assign(ctx, organizerContextMetadata), {
        aliases: organizer.aliases,
        hooks: organizer.getHooks(),
      });
    });
  }

  static __rollbackFns(actions, failedAction, organizer) {
    let i = actions.indexOf(failedAction.constructor);
    let rollbackActions = actions.slice(0, i).reverse();

    return rollbackActions.map((action) => async (ctx) => {
      let organizerContextMetadata = {
        __currentOrganizer: organizer.constructor.name,
        __currentAction: action.name,
      };

      return action.rollBack(
        Object.assign(ctx, organizerContextMetadata),
        organizer.aliases
      );
    });
  }
}

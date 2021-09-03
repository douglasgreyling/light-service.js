import pPipe from "p-pipe";

export default class Organizer {
  static with(context) {
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
      switch (err.constructor.name) {
        case "RollbackError":
          await this.reduceRollback(actions, err.action);
          break;
        default:
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

  static __executeFns(actions, organizer) {
    return actions.map((action) => async (ctx) => {
      let organizerContextMetadata = {
        __currentOrganizer: organizer.constructor.name,
        __currentAction: action.name,
      };

      return action.execute(
        Object.assign(ctx, organizerContextMetadata),
        organizer.aliases
      );
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

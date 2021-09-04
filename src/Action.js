import pEachSeries from "p-each-series";

import Context from "./Context.js";
import ActionStep from "./ActionStep.js";
import RollbackActionStep from "./RollbackActionStep.js";
import ExpectedKeysNotInContextError from "./errors/ExpectedKeysNotInContextError.js";
import PromisedKeysNotInContextError from "./errors/PromisedKeysNotInContextError.js";
import RollbackError from "./errors/RollbackError.js";

export default class Action {
  static async execute(context = {}, aliases = {}) {
    const action = new this(context, aliases);

    const steps = [
      ActionStep.create(action, action.__setDefaultExpectations.bind(action)),
      ActionStep.create(action, action.__checkExpectations.bind(action)),
      ActionStep.create(action, action.executed.bind(action)),
      ActionStep.create(action, action.__checkPromises.bind(action)),
    ];

    this.__includeHooks(action, steps);

    await pEachSeries(steps, async (step) => step(action.context));

    this.__triggerOrganizerRollbackIfNecessary(action);

    action.cleanContext();

    return action.context;
  }

  static async rollBack(context = {}, aliases = {}) {
    const action = new this(context, aliases);

    const steps = [];

    if (action.rolledBack) {
      steps.push(RollbackActionStep.create(action.rolledBack.bind(action)));
    }

    await pEachSeries(steps, async (step) => step(action.context));

    action.cleanContext();

    return action.context;
  }

  constructor(context = {}, aliases = {}) {
    this.context = this.__buildContext(context);
    this.expects = [];
    this.promises = [];

    this.context.registerAliases(aliases);
  }

  fail(message = undefined, opts = {}) {
    this.context.fail(message, opts);
  }

  failAndReturn(message = undefined, opts = {}) {
    this.context.failAndReturn(message, opts);
  }

  failWithRollback(message = undefined, opts = {}) {
    this.context.failWithRollback(message, opts);
  }

  nextContext() {
    this.context.nextContext();
  }

  skipRemaining() {
    this.context.skipRemaining();
  }

  cleanContext() {
    this.context.cleanActionContext();
  }

  async __setDefaultExpectations() {
    if (this.expects.constructor.name == "Array") {
      return;
    }

    const fields = this.expects.fields;

    if (this.expects.defaults) {
      await pEachSeries(fields, async (f) => {
        if (f in this.expects.defaults && f in this.context === false) {
          let fieldDefault = this.expects.defaults[f];

          if (typeof fieldDefault === "function") {
            fieldDefault = await fieldDefault(this.context);
          }

          this.context[f] = fieldDefault;
        }
      });
    }

    this.expects = fields;
  }

  static __includeHooks(action, steps) {
    if (action.beforeEach) {
      steps.splice(
        1,
        0,
        ActionStep.create(action, action.beforeEach.bind(action))
      );
    }

    if (action.afterEach) {
      steps.push(ActionStep.create(action, action.afterEach.bind(action)));
    }

    if (action.aroundEach) {
      steps.splice(
        1,
        0,
        ActionStep.create(action, action.aroundEach.bind(action))
      );
      steps.push(ActionStep.create(action, action.aroundEach.bind(action)));
    }
  }

  __buildContext(context) {
    return context.constructor.name == "Context"
      ? context
      : new Context(context);
  }

  __checkExpectations() {
    let missingExpectations = [];

    this.expects.forEach((expect) => {
      if (expect in this.context === false) {
        missingExpectations.push(expect);
      }
    });

    if (0 < missingExpectations.length) {
      throw new ExpectedKeysNotInContextError(missingExpectations);
    }
  }

  __checkPromises() {
    let missingPromises = [];

    this.promises.forEach((promise) => {
      if (promise in this.context === false) {
        missingPromises.push(promise);
      }
    });

    if (0 < missingPromises.length) {
      throw new PromisedKeysNotInContextError(missingPromises);
    }
  }

  static __triggerOrganizerRollbackIfNecessary(action) {
    if (
      action.context.currentOrganizer() !== undefined &&
      action.context.__rollback
    ) {
      throw new RollbackError(action);
    }
  }
}

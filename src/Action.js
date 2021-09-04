import pEachSeries from "p-each-series";

import Context from "./Context.js";
import ActionExecutionStep from "./ActionExecutionStep.js";
import ActionRollbackStep from "./ActionRollbackStep.js";
import ExpectedKeysNotInContextError from "./errors/ExpectedKeysNotInContextError.js";
import PromisedKeysNotInContextError from "./errors/PromisedKeysNotInContextError.js";
import RollbackError from "./errors/RollbackError.js";

export default class Action {
  static async execute(context = {}, aliases = {}) {
    const action = new this(context, aliases);

    const steps = this.__generateExecuteSteps(action);

    await pEachSeries(steps, async (step) => step(action.context));

    if (action.shouldRollback()) this.__triggerOrganizerRollback(action);

    return action.cleanContext();
  }

  static async rollBack(context = {}, aliases = {}) {
    const action = new this(context, aliases);

    const steps = this.__generateRollbackSteps(action);

    await pEachSeries(steps, async (step) => step(action.context));

    return action.cleanContext();
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
    return this.context.cleanActionContext();
  }

  shouldRollback() {
    return this.context.shouldRollback();
  }

  // private

  static __generateExecuteSteps(action) {
    let steps = [
      action.__setDefaultExpectations,
      action.__checkExpectations,
      action.executed,
      action.__checkPromises,
    ];

    steps = this.__includeHooks([...steps], action);

    return steps.map((s) => ActionExecutionStep.create(action, s.bind(action)));
  }

  static __includeHooks(steps, action) {
    if (action.beforeEach) steps.splice(1, 0, action.beforeEach);

    if (action.afterEach) steps.push(action.afterEach);

    if (action.aroundEach) {
      steps.splice(1, 0, action.aroundEach);
      steps.push(action.aroundEach);
    }

    return steps;
  }

  static __generateRollbackSteps(action) {
    let steps = [];

    if (action.rolledBack) steps.push(action.rolledBack.bind(action));

    return steps.map((s) => ActionRollbackStep.create(s.bind(action)));
  }

  static __triggerOrganizerRollback(action) {
    throw new RollbackError(action);
  }

  __buildContext(context) {
    return context.constructor.name == "Context"
      ? context
      : new Context(context);
  }

  async __setDefaultExpectations() {
    if (this.expects.constructor.name == "Array") return;

    const fields = this.expects.fields;
    const defaults = Object.entries(this.expects.defaults || {});

    await pEachSeries(defaults, async ([dfName, dValue]) => {
      if (fields.includes(dfName) && dfName in this.context === false) {
        if (typeof dValue === "function") {
          dValue = await dValue(this.context);
        }

        this.context[dfName] = dValue;
      }
    });

    this.expects = fields;
  }

  __checkExpectations() {
    const missingExpectations = this.expects.filter(
      (expect) => expect in this.context === false
    );

    if (0 < missingExpectations.length)
      throw new ExpectedKeysNotInContextError(missingExpectations);
  }

  __checkPromises() {
    const missingPromises = this.promises.filter(
      (promise) => promise in this.context === false
    );

    if (0 < missingPromises.length)
      throw new PromisedKeysNotInContextError(missingPromises);
  }
}

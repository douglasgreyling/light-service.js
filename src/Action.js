const eachSeries = require("./utils/eachSeries.js");

const { Context } = require("./Context.js");
const ActionExecutionStep = require("./ActionExecutionStep.js");
const ExpectedKeysNotInContextError = require("./errors/ExpectedKeysNotInContextError.js");
const PromisedKeysNotInContextError = require("./errors/PromisedKeysNotInContextError.js");
const RollbackError = require("./errors/RollbackError.js");

module.exports = class Action {
  static async execute(context = {}, opts = {}) {
    const action = new this(context, opts);

    const steps = this.__generateExecuteSteps(action);

    action.__ran = ActionExecutionStep.shouldExecuteStep(action.context);

    await eachSeries(steps, async (step) => step(action.context));

    if (action.shouldRollback()) this.__triggerOrganizerRollback(action);

    return action.cleanContext();
  }

  static async rollBack(context = {}, aliases = {}) {
    const action = new this(context, { aliases });

    const steps = this.__generateRollbackSteps(action);

    await eachSeries(steps, async (step) => step(action.context));

    return action.cleanContext();
  }

  constructor(context = {}, { aliases = {}, hooks = {} } = {}) {
    this.context = this.__buildContext(context);
    this.expects = [];
    this.promises = [];
    this.hooks = hooks;

    this.__ran = false;
    this.__executedRan = false;

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
      { fn: action.__setDefaultExpectations },
      { fn: action.__checkExpectations },
      { fn: action.executed, marksExecution: true },
      { fn: action.__checkPromises },
    ];

    this.__setHooks(steps, action);

    return steps.map(({ fn, ...opts }) =>
      ActionExecutionStep.create(action, fn.bind(action), opts),
    );
  }

  static __setHooks(steps, { hooks = {} }) {
    if (hooks.beforeEach)
      steps.splice(1, 0, { fn: hooks.beforeEach, isHook: true });

    if (hooks.afterEach) steps.push({ fn: hooks.afterEach, isHook: true });

    if (hooks.aroundEach) {
      steps.splice(1, 0, { fn: hooks.aroundEach, isHook: true });
      steps.push({ fn: hooks.aroundEach, isHook: true });
    }
  }

  static __generateRollbackSteps(action) {
    if (!action.rolledBack) return [];

    return [action.rolledBack.bind(action)];
  }

  static __triggerOrganizerRollback(action) {
    throw new RollbackError(action);
  }

  __buildContext(context) {
    return context instanceof Context ? context : new Context(context);
  }

  async __setDefaultExpectations() {
    if (Array.isArray(this.expects)) return;

    const { fields, defaults = {} } = this.expects;

    if (!Array.isArray(fields))
      throw new Error(
        "expects must be an array of keys, or an object with a fields array",
      );

    await eachSeries(Object.entries(defaults), async ([name, value]) => {
      if (!fields.includes(name) || name in this.context) return;

      this.context[name] =
        typeof value === "function" ? await value(this.context) : value;
    });

    this.expects = fields;
  }

  __checkExpectations() {
    this.__checkContextFor(this.expects, ExpectedKeysNotInContextError);
  }

  __checkPromises() {
    this.__checkContextFor(this.promises, PromisedKeysNotInContextError);
  }

  __checkContextFor(keys, MissingKeysError) {
    const missing = keys.filter((key) => key in this.context === false);

    if (missing.length > 0) throw new MissingKeysError(missing);
  }
};

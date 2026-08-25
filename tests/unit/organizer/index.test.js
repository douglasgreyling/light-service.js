const Valid = require("../../fixtures/organizers/Valid.js");
const SkipActions = require("../../fixtures/organizers/SkipActions.js");
const FailContext = require("../../fixtures/organizers/FailContext.js");
const FailContextAndReturns = require("../../fixtures/organizers/FailContextAndReturns.js");
const SkipRemaining = require("../../fixtures/organizers/SkipRemaining.js");
const Rollback = require("../../fixtures/organizers/Rollback.js");
const RollbackWithNoHandler = require("../../fixtures/organizers/RollbackWithNoHandler.js");
const AsyncRollback = require("../../fixtures/organizers/AsyncRollback.js");
const RollbackFromFirstAction = require("../../fixtures/organizers/RollbackFromFirstAction.js");
const RepeatedActionRollback = require("../../fixtures/organizers/RepeatedActionRollback.js");
const ThrowsError = require("../../fixtures/organizers/ThrowsError.js");
const NamedForMinifiers = require("../../fixtures/organizers/NamedForMinifiers.js");
const NoActions = require("../../fixtures/organizers/NoActions.js");
const HookContext = require("../../fixtures/organizers/HookContext.js");
const RollbackFromHook = require("../../fixtures/organizers/RollbackFromHook.js");
const HooksAroundFailure = require("../../fixtures/organizers/HooksAroundFailure.js");
const HooksSkippedAction = require("../../fixtures/organizers/HooksSkippedAction.js");
const RollbackError = require("../../../src/errors/RollbackError.js");
const OrganizerMetadata = require("../../fixtures/organizers/OrganizerMetadata.js");
const Alias = require("../../fixtures/organizers/Alias.js");
const AroundHooks = require("../../fixtures/organizers/AroundHooks.js");
const BeforeHooks = require("../../fixtures/organizers/BeforeHooks.js");
const AfterHooks = require("../../fixtures/organizers/AfterHooks.js");
const AllHooks = require("../../fixtures/organizers/AllHooks.js");

test("returns the context untouched when there are no actions", async () => {
  const result = await NoActions.call(1);

  expect(result.number).toEqual(1);
  expect(result.success()).toBe(true);
});

test("executes valids actions", async () => {
  const result = await Valid.call(1);

  expect(result.number).toEqual(3);
});

test("does not execute following actions once context is failed", async () => {
  const result = await FailContext.call(1);

  expect(result.failure()).toBe(true);
  expect(result.number).toEqual(3);
});

test("executes actions whilst skipping actions where necessary", async () => {
  const result = await SkipActions.call(1);

  expect(result.number).toEqual(4);
});

test("executes actions until the context is failed and returned", async () => {
  const result = await FailContextAndReturns.call(1);

  expect(result.number).toEqual(2);
});

test("executes actions until the context is marked to skip remaining actions", async () => {
  const result = await SkipRemaining.call(1);

  expect(result.number).toEqual(3);
});

test("executes rollbacks correctly", async () => {
  const result = await Rollback.call(1);

  expect(result.number).toEqual(1);
});

test("executes rollbacks correctly when actions do not have rollback handlers", async () => {
  const result = await RollbackWithNoHandler.call(1);

  expect(result.number).toEqual(2);
});

test("executes rollbacks when the first action is the one that fails", async () => {
  const result = await RollbackFromFirstAction.call(1);

  expect(result.number).toEqual(1);
  expect(result.failure()).toBe(true);
});

// The failing action is found by its position in the chain, not by its class,
// so a class used more than once still rolls back the right actions.
test("executes rollbacks when the same action appears more than once", async () => {
  const result = await RepeatedActionRollback.call(1);

  expect(result.number).toEqual(1);
  expect(result.failure()).toBe(true);
});

test("waits for an async rolledBack on the action that failed", async () => {
  const result = await AsyncRollback.call(1);

  expect(result.asyncRollbackFinished).toBe(true);
});

// Bundlers that minify rewrite class names, so the framework must not identify
// its own control-flow errors by name.
test("executes rollbacks when class names have been mangled", async () => {
  const realName = RollbackError.name;
  Object.defineProperty(RollbackError, "name", {
    value: "",
    configurable: true,
  });

  try {
    const result = await Rollback.call(1);

    expect(result.number).toEqual(1);
  } finally {
    Object.defineProperty(RollbackError, "name", {
      value: realName,
      configurable: true,
    });
  }
});

test("propagates errors an action did not intend to handle", async () => {
  await expect(ThrowsError.call(1)).rejects.toThrow(
    "something unexpected happened",
  );
});

test("prefers displayName over the class name for metadata", async () => {
  const result = await NamedForMinifiers.call();

  expect(result.organizer).toEqual("MyOrganizer");
});

test("sets the organizer metadata for the actions", async () => {
  const result = await OrganizerMetadata.call();

  expect(result.action).toEqual("OrganizerMetadataAction");
  expect(result.organizer).toEqual("OrganizerMetadata");
});

test("registers aliases for actions to use", async () => {
  const result = await Alias.call(1);

  expect(result.number).toEqual(3);
});

test("executes around hook before and after executed step", async () => {
  const result = await AroundHooks.call([]);

  expect(result.order).toEqual(["around", "executed", "around"]);
});

test("executes before hook before executed step", async () => {
  const result = await BeforeHooks.call([]);

  expect(result.order).toEqual(["before", "executed"]);
});

test("executes after hook after executed step", async () => {
  const result = await AfterHooks.call([]);

  expect(result.order).toEqual(["executed", "after"]);
});

test("runs hooks with the organizer as their receiver", async () => {
  const result = await HookContext.call([]);

  expect(result.hookThis).toEqual("the organizer");
});

// The hook fails before the action reaches `executed`, so there is nothing
// for the action to undo.
test("does not roll back an action a hook stopped before it ran", async () => {
  const result = await RollbackFromHook.call([]);

  expect(result.order).toEqual([]);
});

// aroundEach brackets the action, so the closing half has to run even when the
// action returned early.
test("closes hooks around an action which failed", async () => {
  const result = await HooksAroundFailure.call([]);

  expect(result.order).toEqual(["around", "after", "around"]);
});

test("runs no hooks for an action which was skipped outright", async () => {
  const result = await HooksSkippedAction.call([]);

  expect(result.order).toEqual(["around", "after", "around"]);
});

test("executes all hooks in the correct order", async () => {
  const result = await AllHooks.call([]);

  expect(result.order).toEqual([
    "around",
    "before",
    "executed",
    "after",
    "around",
  ]);
});

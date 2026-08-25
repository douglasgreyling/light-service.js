const {
  CLEANABLE_ACTION_CONTEXT_KEYS,
  CLEANABLE_ORGANIZER_CONTEXT_KEYS,
  Context,
} = require("../../../src/Context.js");
const SkipActionError = require("../../../src/errors/SkipActionError.js");
const RollbackError = require("../../../src/errors/RollbackError.js");
const AliasKeyAlreadyInContextError = require("../../../src/errors/AliasKeyAlreadyInContextError.js");
const ReservedContextKeysError = require("../../../src/errors/ReservedContextKeysError.js");

test("sets properties on initialization", () => {
  const context = new Context({ foo: 1, bar: 2 });

  expect(context).toEqual(
    expect.objectContaining({
      foo: 1,
      bar: 2,
    }),
  );
});

test("success returns the correct value", () => {
  const context = new Context({ foo: 1, bar: 2 });

  expect(context.success()).toBe(true);
});

test("failure returns the correct value", () => {
  const context = new Context({ foo: 1, bar: 2 });

  expect(context.failure()).toBe(false);
});

test("failing the context marks the context as such", () => {
  const context = new Context({ foo: 1, bar: 2 });

  context.fail("something went wrong");

  expect(context.failure()).toBe(true);
  expect(context.message()).toEqual("something went wrong");
});

test("failing the context with an error code persists the error code", () => {
  const context = new Context({ foo: 1, bar: 2 });

  context.fail("something went wrong", { errorCode: 123 });

  expect(context.errorCode()).toEqual(123);
});

test("next context triggers next action", () => {
  const context = new Context({ foo: 1, bar: 2 });

  expect(() => context.nextContext()).toThrow(SkipActionError);
  expect(context.__skipAction).toBe(true);
});

test("fail and return fails the context and skips the current action", () => {
  const context = new Context({ foo: 1, bar: 2 });

  expect(() => context.failAndReturn("something went wrong")).toThrow(
    SkipActionError,
  );
  expect(context.__skipAction).toBe(true);
  expect(context.failure()).toBe(true);
  expect(context.message()).toEqual("something went wrong");
});

test("skip remaining marks the context in need of skipping remaining actions", () => {
  const context = new Context({ foo: 1, bar: 2 });

  context.skipRemaining();

  expect(context.__skipRemaining).toBe(true);
});

test("fail with rollback fails the context and marks the context in need of rollback", () => {
  const context = new Context({ foo: 1, bar: 2 });

  expect(() => context.failWithRollback("something went wrong")).toThrow(
    RollbackError,
  );
  expect(context.__rollback).toBe(true);
  expect(context.failure()).toBe(true);
  expect(context.message()).toEqual("something went wrong");
});

test("returns the current organizer", () => {
  const context = new Context({ __currentOrganizer: "Foo" });

  expect(context.currentOrganizer()).toEqual("Foo");
});

test("returns the current action", () => {
  const context = new Context({ __currentAction: "Foo" });

  expect(context.currentAction()).toEqual("Foo");
});

test("returns if the context requires a rollback", () => {
  const context = new Context({ __currentOrganizer: "Foo", __rollback: true });

  expect(context.shouldRollback()).toBe(true);
});

test("clean action context cleans the context of action metadata fields", () => {
  const fieldsToClean = CLEANABLE_ACTION_CONTEXT_KEYS.reduce(
    (o, field, index) => ({ ...o, [field]: index }),
    {},
  );

  const context = new Context({ ...fieldsToClean, foo: "bar" });
  context.cleanActionContext();

  expect(Object.entries(context)).toEqual([
    ["__success", true],
    ["foo", "bar"],
  ]);
});

test("clean organizer context cleans the context of action metadata fields", () => {
  const fieldsToClean = CLEANABLE_ORGANIZER_CONTEXT_KEYS.reduce(
    (o, field, index) => ({ ...o, [field]: index }),
    {},
  );

  const context = new Context({ ...fieldsToClean, foo: "bar" });
  context.cleanOrganizerContext();

  expect(Object.entries(context)).toEqual([
    ["__success", true],
    ["foo", "bar"],
  ]);
});

test("register aliases creates getter and setter aliases for given keys", () => {
  const context = new Context({ foo: 1 });

  context.registerAliases({ foo: "bar" });

  expect(context.bar).toEqual(1);

  context.bar = 2;

  expect(context.foo).toEqual(2);
  expect(context.bar).toEqual(2);
});

test("refuses to alias over a key which already holds a value", () => {
  const context = new Context({ myKey: "real", keyAlias: "pre-existing" });

  expect(() => context.registerAliases({ myKey: "keyAlias" })).toThrow(
    AliasKeyAlreadyInContextError,
  );
});

// Every action in a chain registers the organizer aliases, so this happens on
// every run with more than one action.
test("registers the same alias repeatedly without complaining", () => {
  const context = new Context({ myKey: "real" });

  context.registerAliases({ myKey: "keyAlias" });
  context.registerAliases({ myKey: "keyAlias" });

  expect(context.keyAlias).toEqual("real");
});

test("keeps an empty message and a zero error code", () => {
  const context = new Context({});

  context.fail("", { errorCode: 0 });

  expect(context.message()).toEqual("");
  expect(context.errorCode()).toEqual(0);
});

test("answers shouldRollback with a boolean", () => {
  const context = new Context({});

  context.__currentOrganizer = "SomeOrganizer";

  expect(context.shouldRollback()).toBe(false);
});

// Context data shares an object with the Context API, so a key like `message`
// would otherwise shadow `message()` and only fail when something called it.
test("refuses context keys which would shadow the context API", () => {
  expect(() => new Context({ message: "hi" })).toThrow(
    ReservedContextKeysError,
  );
});

test("names every reserved key it rejected", () => {
  expect(() => new Context({ message: 1, success: 2, order: 3 })).toThrow(
    "The following context keys are reserved by LightService: message,success",
  );
});

test("refuses an alias which would shadow the context API", () => {
  const context = new Context({ userState: "x" });

  expect(() => context.registerAliases({ userState: "failure" })).toThrow(
    ReservedContextKeysError,
  );
});

test("leaves ordinary keys alone", () => {
  const context = new Context({ order: 1, name: "x" });

  expect([context.order, context.name, context.success()]).toEqual([
    1,
    "x",
    true,
  ]);
});

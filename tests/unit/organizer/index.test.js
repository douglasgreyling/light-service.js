import Valid from "../../fixtures/organizers/Valid.js";
import SkipActions from "../../fixtures/organizers/SkipActions.js";
import FailContext from "../../fixtures/organizers/FailContext.js";
import FailContextAndReturns from "../../fixtures/organizers/FailContextAndReturns.js";
import SkipRemaining from "../../fixtures/organizers/SkipRemaining.js";
import Rollback from "../../fixtures/organizers/Rollback.js";
import RollbackWithNoHandler from "../../fixtures/organizers/RollbackWithNoHandler.js";
import OrganizerMetadata from "../../fixtures/organizers/OrganizerMetadata.js";
import Alias from "../../fixtures/organizers/Alias.js";
import AroundHooks from "../../fixtures/organizers/AroundHooks.js";
import BeforeHooks from "../../fixtures/organizers/BeforeHooks.js";
import AfterHooks from "../../fixtures/organizers/AfterHooks.js";
import AllHooks from "../../fixtures/organizers/AllHooks.js";

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

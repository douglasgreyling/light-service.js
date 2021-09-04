import Valid from "../../fixtures/organizer/Valid.js";
import SkipActions from "../../fixtures/organizer/SkipActions.js";
import FailContext from "../../fixtures/organizer/FailContext.js";
import FailContextAndReturns from "../../fixtures/organizer/FailContextAndReturns.js";
import SkipRemaining from "../../fixtures/organizer/SkipRemaining.js";
import Rollback from "../../fixtures/organizer/Rollback.js";
import RollbackWithNoHandler from "../../fixtures/organizer/RollbackWithNoHandler.js";
import OrganizerMetadata from "../../fixtures/organizer/OrganizerMetadata.js";
import Alias from "../../fixtures/organizer/Alias.js";

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

import FailsContext from "../../fixtures/actions/FailsContext.js";
import FailsContextAndReturns from "../../fixtures/actions/FailsContextAndReturns.js";
import FailsContextAndRollsback from "../../fixtures/actions/FailsContextAndRollsback.js";
import FailsContextAndRollsbackWithNoHandler from "../../fixtures/actions/FailsContextAndRollsbackWithNoHandler.js";
import SkipsContext from "../../fixtures/actions/SkipsContext.js";

test("fails the context correctly", async () => {
  const result = await FailsContext.execute({ number: 1 });

  expect(result.failure()).toBe(true);
  expect(result.message()).toEqual("some message");
  expect(result.errorCode()).toEqual(123);

  expect(result.number).toEqual(2);
});

test("fails and returns the context correctly", async () => {
  const result = await FailsContextAndReturns.execute({ number: 1 });

  expect(result.failure()).toBe(true);
  expect(result.message()).toEqual("some message");
  expect(result.errorCode()).toEqual(123);

  expect(result.number).toEqual(1);
});

test("fails and rollsback the context correctly", async () => {
  const result = await FailsContextAndRollsback.execute({ number: 1 });

  expect(result.failure()).toBe(true);
  expect(result.message()).toEqual("some message");
  expect(result.errorCode()).toEqual(123);

  expect(result.number).toEqual(1);
});

test("does nothing when rollback is triggered and no rollback function exists", async () => {
  const result = await FailsContextAndRollsbackWithNoHandler.execute({
    number: 1,
  });

  expect(result.failure()).toBe(true);
  expect(result.message()).toEqual("some message");
  expect(result.errorCode()).toEqual(123);

  expect(result.number).toEqual(2);
});

test("skips the context correctly", async () => {
  const result = await SkipsContext.execute({
    number: 1,
  });

  expect(result.success()).toBe(true);
  expect(result.number).toEqual(2);
});

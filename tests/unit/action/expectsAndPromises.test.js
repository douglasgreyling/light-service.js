import Valid from "../../fixtures/actions/Valid.js";
import MissingPromise from "../../fixtures/actions/MissingPromise.js";
import ExpectsObject from "../../fixtures/actions/ExpectsObject.js";
import ExpectsObjectWithDefaultLiteral from "../../fixtures/actions/ExpectsObjectWithDefaultLiteral.js";
import ExpectsObjectWithDefaultFunction from "../../fixtures/actions/ExpectsObjectWithDefaultFunction.js";
import ExpectsObjectWithMissingDefault from "../../fixtures/actions/ExpectsObjectWithMissingDefault.js";

test("detects missing expectations", async () => {
  await expect(Valid.execute()).rejects.toThrow(
    "The following expected keys were not found in the context: number"
  );
});

test("detects missing promises", async () => {
  await expect(MissingPromise.execute({ number: 1 })).rejects.toThrow(
    "The following promised keys were not found in the context: number"
  );
});

test("allows expects using an object instead of an array", async () => {
  const result = await ExpectsObject.execute({ number: 1 });

  expect(result.number).toEqual(2);
});

test("detects literal as expected field defaults when expects is an object", async () => {
  const result = await ExpectsObjectWithDefaultLiteral.execute();

  expect(result.number).toEqual(2);
});

test("detects functions as expected field defaults when expects is an object", async () => {
  const result = await ExpectsObjectWithDefaultFunction.execute();

  expect(result.number).toEqual(2);
});

test("ignores expected field defaults when expects is an object and fields do not exist inside the context", async () => {
  await expect(ExpectsObjectWithMissingDefault.execute()).rejects.toThrow(
    "The following expected keys were not found in the context: number"
  );
});

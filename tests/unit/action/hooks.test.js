import AroundHooks from "../../fixtures/actions/AroundHooks.js";
import BeforeHook from "../../fixtures/actions/BeforeHook.js";
import AfterHook from "../../fixtures/actions/AfterHook.js";
import AllHooks from "../../fixtures/actions/AllHooks.js";

test("executes around hook before and after executed step", async () => {
  const result = await AroundHooks.execute({ order: [] });

  expect(result.order).toEqual(["around", "executed", "around"]);
});

test("executes before hook before executed step", async () => {
  const result = await BeforeHook.execute({ order: [] });

  expect(result.order).toEqual(["before", "executed"]);
});

test("executes after hook after executed step", async () => {
  const result = await AfterHook.execute({ order: [] });

  expect(result.order).toEqual(["executed", "after"]);
});

test("executes all hooks in the correct order", async () => {
  const result = await AllHooks.execute({ order: [] });

  expect(result.order).toEqual([
    "around",
    "before",
    "executed",
    "after",
    "around",
  ]);
});

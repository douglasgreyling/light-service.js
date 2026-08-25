const eachSeries = require("../../../src/utils/eachSeries.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("visits every item in order, one at a time", async () => {
  const seen = [];

  await eachSeries([30, 20, 10], async (ms, index) => {
    await delay(ms);

    seen.push([ms, index]);
  });

  expect(seen).toEqual([
    [30, 0],
    [20, 1],
    [10, 2],
  ]);
});

test("resolves promises in the iterable before handing them over", async () => {
  const seen = [];

  await eachSeries([Promise.resolve("a"), "b"], async (value) =>
    seen.push(value),
  );

  expect(seen).toEqual(["a", "b"]);
});

test("returns the iterable it was given", async () => {
  const items = [1, 2];

  await expect(eachSeries(items, async () => {})).resolves.toBe(items);
});

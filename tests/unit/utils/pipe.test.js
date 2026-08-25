const pipe = require("../../../src/utils/pipe.js");

test("threads a value through every function in order", async () => {
  const pipeline = pipe(
    (n) => n + 1,
    (n) => n * 2,
  );

  await expect(pipeline(3)).resolves.toEqual(8);
});

test("awaits asynchronous functions before moving on", async () => {
  const pipeline = pipe(
    async (n) => n + 1,
    (n) => Promise.resolve(n * 2),
  );

  await expect(pipeline(3)).resolves.toEqual(8);
});

test("refuses to build a pipeline out of nothing", () => {
  expect(() => pipe()).toThrow("Expected at least one argument");
});

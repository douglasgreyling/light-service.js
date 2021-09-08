const Valid = require("../../fixtures/actions/Valid.js");

test("executes valids actions", async () => {
  const result = await Valid.execute({ number: 1 });

  expect(result.number).toEqual(2);
});

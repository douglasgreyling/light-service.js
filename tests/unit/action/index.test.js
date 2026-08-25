const Valid = require("../../fixtures/actions/Valid.js");
const Alias = require("../../fixtures/actions/Alias.js");

test("executes valids actions", async () => {
  const result = await Valid.execute({ number: 1 });

  expect(result.number).toEqual(2);
});

test("rolls back using the aliases it was given", async () => {
  const result = await Alias.rollBack({ number: 2 }, { number: "num" });

  expect(result.number).toEqual(1);
});

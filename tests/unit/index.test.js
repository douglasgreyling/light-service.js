const {
  Action,
  Organizer,
  Context,
  ExpectedKeysNotInContextError,
  PromisedKeysNotInContextError,
  RollbackError,
  SkipActionError,
} = require("../../index.js");
const Valid = require("../fixtures/actions/Valid.js");
const MissingPromise = require("../fixtures/actions/MissingPromise.js");

test("exports the public classes", () => {
  expect([
    Action,
    Organizer,
    Context,
    ExpectedKeysNotInContextError,
    PromisedKeysNotInContextError,
    RollbackError,
    SkipActionError,
  ]).not.toContain(undefined);
});

// The library identifies its own errors with instanceof, so consumers need to
// be able to do the same.
test("throws expectation errors consumers can catch by type", async () => {
  await expect(Valid.execute()).rejects.toBeInstanceOf(
    ExpectedKeysNotInContextError,
  );
});

test("throws promise errors consumers can catch by type", async () => {
  await expect(MissingPromise.execute({ number: 1 })).rejects.toBeInstanceOf(
    PromisedKeysNotInContextError,
  );
});

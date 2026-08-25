// Threads a value through a series of async functions, in order.
// Inlined from p-pipe (MIT, Sindre Sorhus) to keep this package dependency-free.

module.exports = (...fns) => {
  if (fns.length === 0) throw new Error("Expected at least one argument");

  return async (input) => {
    let value = input;

    for (const fn of fns) {
      value = await fn(value);
    }

    return value;
  };
};

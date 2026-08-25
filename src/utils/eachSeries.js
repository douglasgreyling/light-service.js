// Runs an async iterator over an iterable one item at a time, in order.
// Inlined from p-each-series (MIT, Sindre Sorhus) to keep this package
// dependency-free.

module.exports = async (iterable, iterator) => {
  let index = 0;

  for (const value of iterable) {
    await iterator(await value, index++);
  }

  return iterable;
};

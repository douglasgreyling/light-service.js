module.exports = class ExpectedKeysNotInContextError extends Error {
  constructor(missingKeys) {
    super();
    this.message = `The following expected keys were not found in the context: ${missingKeys}`;
  }
}

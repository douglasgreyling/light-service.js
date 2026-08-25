module.exports = class AliasKeyAlreadyInContextError extends Error {
  constructor(aliasKey) {
    super();
    this.message = `The alias key is already in the context: ${aliasKey}`;
  }
};

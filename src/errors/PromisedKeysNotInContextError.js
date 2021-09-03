export default class PromisedKeysNotInContextError extends Error {
  constructor(missingKeys) {
    super();
    this.message = `The following promised keys were not found in the context: ${missingKeys}`;
  }
}

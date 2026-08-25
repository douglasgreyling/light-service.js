module.exports = class ReservedContextKeysError extends Error {
  constructor(reservedKeys) {
    super();
    this.message = `The following context keys are reserved by LightService: ${reservedKeys}`;
  }
};

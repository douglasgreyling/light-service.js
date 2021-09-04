import Action from "../../../src/Action.js";

export default class ExpectsObjectWithDefaultLiteral extends Action {
  expects = { fields: ["number"], defaults: { number: 1 } };
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
  }
}

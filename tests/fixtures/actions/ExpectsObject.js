import Action from "../../../src/Action.js";

export default class ExpectsObject extends Action {
  expects = { fields: ["number"] };
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
  }
}

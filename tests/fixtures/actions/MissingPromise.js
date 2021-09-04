import Action from "../../../src/Action.js";

export default class MissingPromise extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    delete this.context.number;
    this.context.newNumber = number + 1;
  }
}

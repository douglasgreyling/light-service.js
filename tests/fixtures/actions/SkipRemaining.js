import Action from "../../../src/Action.js";

export default class SkipRemaining extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.context.number = number + 1;
    this.skipRemaining();
  }
}

import Action from "../../../src/Action.js";

export default class BeforeHookObject extends Action {
  expects = ["order"];
  promises = ["order"];

  beforeEach() {
    this.context.order.push("before");
  }

  executed() {
    this.context.order.push("executed");
  }
}

import Action from "../../../src/Action.js";

export default class AfterHookObject extends Action {
  expects = ["order"];
  promises = ["order"];

  afterEach() {
    this.context.order.push("after");
  }

  executed() {
    this.context.order.push("executed");
  }
}

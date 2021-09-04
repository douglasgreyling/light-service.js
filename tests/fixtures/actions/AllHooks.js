import Action from "../../../src/Action.js";

export default class AfterHookObject extends Action {
  expects = ["order"];
  promises = ["order"];

  aroundEach() {
    this.context.order.push("around");
  }

  beforeEach() {
    this.context.order.push("before");
  }

  afterEach() {
    this.context.order.push("after");
  }

  executed() {
    this.context.order.push("executed");
  }
}

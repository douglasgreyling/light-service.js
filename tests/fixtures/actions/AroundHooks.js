import Action from "../../../src/Action.js";

export default class AroundHooksObject extends Action {
  expects = ["order"];
  promises = ["order"];

  aroundEach() {
    this.context.order.push("around");
  }

  executed() {
    this.context.order.push("executed");
  }
}

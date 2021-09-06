import Action from "../../../src/Action.js";

export default class Hooks extends Action {
  expects = ["order"];
  promises = ["order"];

  executed() {
    this.context.order.push("executed");
  }
}

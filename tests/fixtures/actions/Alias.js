import Action from "../../../src/Action.js";

export default class Alias extends Action {
  expects = ["num"];
  promises = ["num"];

  executed({ num }) {
    this.context.num = num + 1;
  }

  rolledBack({ num }) {
    this.context.num = num - 1;
  }
}

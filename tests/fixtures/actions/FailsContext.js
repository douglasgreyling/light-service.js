import Action from "../../../src/Action.js";

export default class FailsContext extends Action {
  expects = ["number"];
  promises = ["number"];

  executed({ number }) {
    this.fail("some message", { errorCode: 123 });
    this.context.number = number + 1;
  }
}

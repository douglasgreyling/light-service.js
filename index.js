import Action from "./src/Action.js";
import Organizer from "./src/Organizer.js";
import Context from "./src/Context.js";

function resolveAfter1Second(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });
}

class GreetsPerson extends Action {
  expects = ["name"];
  promises = ["greeting"];

  async executed({ name }) {
    const newName = await resolveAfter1Second("George");
    this.context.greeting = `hello ${newName}`;
  }
}

class AddsOne extends Action {
  expects = ["number"];
  promises = ["newOneNumber"];

  executed({ number }) {
    this.context.newOneNumber = number + 1;
  }

  rolledBack(context) {
    console.log("deleting sync");
    delete context.newOneNumber;
  }
}

class AddsTwo extends Action {
  expects = ["number"];
  promises = ["newOneNumber"];

  executed({ number }) {
    this.context.newOneNumber = number + 2;
  }
}

class AsyncAddsOne extends Action {
  expects = ["number"];
  promises = ["newTwoNumber"];

  async executed({ number }) {
    this.context.newTwoNumber = await resolveAfter1Second(number + 1);
    this.failWithRollback();
  }

  rolledBack(context) {
    delete context.newTwoNumber;
  }
}

class OrganizesSomething extends Organizer {
  aliases = { number: "num" };

  static async call(number) {
    return this.with({ number }).reduce(
      AddsOne,
      AddsTwo,
      AsyncAddsOne,
      AddsOne
    );
  }
}

const res = await OrganizesSomething.call(1);
console.log(res);
// => { __success: true, number: 1, newNumber: 3 }

// let foo = await GreetsPerson.execute({ name: "Doug" });
// console.log(foo);
// console.log(foo.success());

// let foo = await AddsOne.execute({ number: 1 });
// console.log(foo);

// foo = await AsyncAddsOne.execute({ number: 1 });
// console.log(foo);

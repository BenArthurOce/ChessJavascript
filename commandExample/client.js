

import CommandSample1 from "./CommandSample1.js";
import CommandSample2 from "./CommandSample2.js";
import CommandSample3 from "./CommandSample3.js";

import Invoker from "./Invoker.js";
import Receiver from "./Receiver.js";

const myObject = {}

// # Create a receiver
const myReceiver = new Receiver()

const COMMAND_ONE = new CommandSample1(myReceiver, myObject)
const COMMAND_TWO = new CommandSample2(myReceiver, myObject)
const COMMAND_THREE = new CommandSample3(myReceiver, myObject)





// # Register the commands with the invoker
const myInvoker = new Invoker()

myInvoker.register("command_one", COMMAND_ONE)
myInvoker.register("command_two", COMMAND_TWO)
myInvoker.register("command_three", COMMAND_THREE)

myInvoker.execute("command_one")

console.log(myObject)
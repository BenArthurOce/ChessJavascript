import FrontPage from "./libs/FrontPage.js";

import Invoker from "./command/()Invoker.js";
import Receiver from "./command/()Receiver.js";

import CommandSample1 from "./command/CommandSample1.js";
import CommandSample2 from "./command/CommandSample2.js";
import CommandSample3 from "./command/CommandSample3.js";


import MovePieceCommand from "./command/MovePieceCommand.js";
import PlacePiecesFromFENCommand from "./command/PlacePiecesFromFENCommand.js";

import CreateMainBoard from "./command/CreateMainBoard.js";

import CreateDictionary from "./command/CreateDictionary.js";



let myObject = {}
let gameObject = ''
let fen = ''


function updateFEN(newFEN) {
    fen = newFEN
    COMMAND_PLACE_FROM_FEN = new PlacePiecesFromFENCommand(myReceiver, gameObject, fen)
    myInvoker.register("place_from_fen", COMMAND_PLACE_FROM_FEN)
}

// # Create a receiver
const myReceiver = new Receiver()

let COMMAND_ONE = new CommandSample1(myReceiver, myObject)
let COMMAND_TWO = new CommandSample2(myReceiver, myObject)
let COMMAND_THREE = new CommandSample3(myReceiver, myObject)

let COMMAND_MOVE_PIECE = new MovePieceCommand(myReceiver, myObject)

let COMMAND_PLACE_FROM_FEN = new PlacePiecesFromFENCommand(myReceiver, gameObject, fen)


let COMMAND_CREATE_MAIN_BOARD = new CreateMainBoard(myReceiver)

let COMMAND_CREATE_DICTIONARY = new CreateDictionary(myReceiver)


// # Register the commands with the invoker
const myInvoker = new Invoker()

myInvoker.register("command_one", COMMAND_ONE)
myInvoker.register("command_two", COMMAND_TWO)
myInvoker.register("command_three", COMMAND_THREE)

myInvoker.register("move_piece", COMMAND_MOVE_PIECE)

myInvoker.register("place_from_fen", COMMAND_PLACE_FROM_FEN)


myInvoker.register("create_main_board", COMMAND_CREATE_MAIN_BOARD)

myInvoker.register("create_dictionary", COMMAND_CREATE_DICTIONARY)

// Update the FEN variable
updateFEN("aaaaa")


// myInvoker.execute("command_one")
// myInvoker.execute("move_piece")
myInvoker.execute("place_from_fen")
myInvoker.execute("create_main_board")
myInvoker.execute("create_dictionary")


// console.log(myObject)

const frontpage = new FrontPage()

frontpage.btnDebug3.addEventListener('click', (event) => {
    frontpage.clickEvent_Debugging3()
    myInvoker.execute("move_piece")
})
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

import JSONReader from "./libs/JSONReader.js";
import { Dictionary, ChessDictionary } from "./libs/Dictionary.js";


import DictionaryNEW from "./PatternSearchDictionary/DictionaryNew.js";
import JSONReaderNEW from "./PatternSearchDictionary/JSONReaderNEW.js";



let myObject = {}
let gameObject = ''
let fen = ''
let dictionary = new ChessDictionary();


  // Step 1: We read the JSON file of all the openings
  async function initDictionary() {
    const filepath = './data/openings_data.json';

    // Find the JSON file and read the data
    const jsonData = await readJSONFile(filepath);

    // Go through each JSON item and add it to the Dictionary() class
    Object.entries(jsonData).forEach(([key, value]) => dictionary.set(key, value));

    // In the Dictionary() Object, parse "MOVESTRING" into "MOVEOBJ"
    dictionary.updateWithMoveObj();
  }

  // Convert JSON file into a javascript object
  async function readJSONFile(filePath) {
    const jsonReader = new JSONReader(filePath);
    return await jsonReader.readJSON();
  }

  await initDictionary()


const dictionaryNEW = new DictionaryNEW();


// Usage Example
(async () => {
    const filePath = './data/openings_data.json';
    const jsonReader = new JSONReaderNEW(filePath);
    const dictionary = new DictionaryNEW();

    await jsonReader.populateDictionary(dictionary);

    console.log(dictionary.getState()); // View the state of the dictionary
})();


console.log("--------------------")
console.log(dictionary)


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

console.log("----------------------------")
console.log("----------------------------")
console.log("----------------------------")

import {DictionarySearchStrategy, SearchByKeyStrategy, SearchByValueStrategy, SearchByIdStrategy, SearchByFENStrategy, SearchByECOStrategy, SearchByNameStrategy} from "./PatternSearchDictionary/DictionarySearchStrategy.js";
import DictionarySearchContext from "./PatternSearchDictionary/DictionarySearchContext.js";

// Initialize the dictionary
let myDictionary = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3'
  };
  
  // Create a search context
  const searchContext = new DictionarySearchContext(new SearchByKeyStrategy());
  
  // Search by key
  let result = searchContext.search(myDictionary, { key: 'key1' });
  console.log(result); // Output: value1
  
  // Change strategy to search by value
  searchContext.setStrategy(new SearchByValueStrategy());
  result = searchContext.search(myDictionary, { value: 'value2' });
  console.log(result); // Output: key2

  console.log("----------------------------")
  console.log("----------------------------")
  console.log("----------------------------")




// Initialize the dictionary
let myDictionary2 = {
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR": {
      "ID": 1,
      "FEN": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
      "ECO": "--",
      "VOLUME": "-",
      "NAME": "--",
      "PGN": "1.",
      "MOVESSTRING": "[{1 || }]",
      "BOARDSTRING": "[1R || 1N || 1B || 1Q || 1K || 1B || 1N || 1R || 1p || 1p || 1p || 1p || 1p || 1p || 1p || 1p || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || 0p || 0p || 0p || 0p || 0p || 0p || 0p || 0p || 0R || 0N || 0B || 0Q || 0K || 0B || 0N || 0R]",
      "NUMTURNS": 1,
      "NUMMOVES": 0,
      "NEXTTOMOVE": "Black",
      "FAMILY": "--",
      "VARIATION": null,
      "SUBVARIATION": null,
      "CHECKMATE": false,
      "CASTLINGWHITE": null,
      "CASTLINGBLACK": null,
      "CONTINUATIONSNEXT": [2, 6, 8, 13, 20, 40, 59, 69, 72, 95, 96, 101, 131, 137, 142, 157, 191, 266, 463, 738],
      "CONTINUATIONSFULL": [],
      "FAVOURITE": null,
      "ISERROR": null,
      "COMMON": null
    },
    "rnbqkbnr/pppppppp/8/8/8/7N/PPPPPPPP/RNBQKB1R": {
      "ID": 2,
      "FEN": "rnbqkbnr/pppppppp/8/8/8/7N/PPPPPPPP/RNBQKB1R",
      "ECO": "A00",
      "VOLUME": "A",
      "NAME": "Amar Opening",
      "PGN": "1.Nh3",
      "MOVESSTRING": "[{1 || Nh3}]",
      "BOARDSTRING": "[1R || 1N || 1B || 1Q || 1K || 1B || 1N || 1R || 1p || 1p || 1p || 1p || 1p || 1p || 1p || 1p || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || - || 0N || 0p || 0p || 0p || 0p || 0p || 0p || 0p || 0p || 0R || 0N || 0B || 0Q || 0K || 0B || - || 0R]",
      "NUMTURNS": 1,
      "NUMMOVES": 1,
      "NEXTTOMOVE": "Black",
      "FAMILY": "Amar Opening",
      "VARIATION": null,
      "SUBVARIATION": null,
      "CHECKMATE": false,
      "CASTLINGWHITE": null,
      "CASTLINGBLACK": null,
      "CONTINUATIONSNEXT": [],
      "CONTINUATIONSFULL": [],
      "FAVOURITE": null,
      "ISERROR": null,
      "COMMON": null
    },
    // More dictionary entries
  };
  
  // Create a search context
  const searchContext2 = new DictionarySearchContext(new SearchByIdStrategy());
  
  // Search by ID
  let result2 = searchContext2.search(myDictionary2, { ID: 2 });
  console.log(result2); // Output: Entry with ID 2
  
  // Change strategy to search by FEN
  searchContext2.setStrategy(new SearchByFENStrategy());
  result2 = searchContext2.search(myDictionary2, { FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" });
  console.log(result2); // Output: Entry with FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
  
  // Change strategy to search by ECO
  searchContext2.setStrategy(new SearchByECOStrategy());
  result2 = searchContext2.search(myDictionary2, { ECO: "A00" });
  console.log(result2); // Output: Entries with ECO "A00"
  
  // Change strategy to search by NAME
  searchContext.setStrategy(new SearchByNameStrategy());
  result = searchContext.search(myDictionary2, { NAME: "Amar Opening" });
  console.log(result); // Output: Entries with NAME containing "Amar Opening"
  
  console.log("----------------------------")
  console.log("----------------------------")
  console.log("----------------------------")
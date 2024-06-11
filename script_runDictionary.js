// This script is to disregard the website functionality, and to test the notation strings and see what errors come up
// This script does not automatically resolve errors, however.

import { Game, GameSmall } from "./libs/Game.js";
import JSONReader from "./libs/JSONReader.js";
import { Dictionary, ChessDictionary } from "./libs/Dictionary.js";

class ChessOpeningsTest {
  #dictionary;

  constructor() {
    this.#dictionary = new ChessDictionary();
  }

  // Step 1: We read the JSON file of all the openings
  async initDictionary() {
    const filepath = './data/newChessOpenings.json';

    // Find the JSON file and read the data
    const jsonData = await this.readJSONFile(filepath);

    // Go through each JSON item and add it to the Dictionary() class
    Object.entries(jsonData).forEach(([key, value]) => this.#dictionary.set(key, value));

    // In the Dictionary() Object, parse "MOVESTRING" into "MOVEOBJ"
    this.#dictionary.updateWithMoveObj();
  }

  // Convert JSON file into a javascript object
  async readJSONFile(filePath) {
    const jsonReader = new JSONReader(filePath);
    return await jsonReader.readJSON();
  }

  get dictionary() {
    return this.#dictionary;
  }
}

// Instantiate the class and initialize the dictionary
const chessTest = new ChessOpeningsTest();
await chessTest.initDictionary();



// // ///-------------------------------------RUNS ONE GAME AND FEN-------------------------------------

// const dictionaryResults  = chessTest.dictionary.filterName("Italian Game: Scotch Gambit; Anderssen Attack; Main Line")
// const myOpening = dictionaryResults[0]
// console.log(myOpening)

//   let gameTest = new GameSmall(myOpening, 1);

//   gameTest.setParser()
//   gameTest.createChessBoardFORTESTING()
//   gameTest.runGameWithParserObject()

//   console.log(gameTest.board.constructFEN())

//   gameTest.board.printToTerminal();


// ///-------------------------------------RUNS ALL GAMES-------------------------------------
// let index = 0;
// chessTest.dictionary.forEach((value, key) => {
//   index += 1;
//   console.log(index);  // Print the number


//   let gameTest = new GameSmall(key, index);

//   gameTest.setParser()
//   gameTest.createChessBoardFORTESTING()
//   gameTest.runGameWithParserObject()

//   gameTest.board.printToTerminal();


// });

// console.log("NO ERRORS FOUND WOOO");


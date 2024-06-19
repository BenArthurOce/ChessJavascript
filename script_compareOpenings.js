
// import FrontPage from "./libs/FrontPageUsingLogic.js";
// import FrontPageUsingFEN from "./libs/FrontPageUsingFEN.js";


import { Game, GameLarge, GameSmall } from "./libs/GameUsingLogic.js";
import { Piece } from "./libs/Piece.js";

const emptyOpening = { ID: null, FEN: "", ECO: "", VOLUME: "", NAME: "", PGN: "", BOARDSTRING: "", MOVESSTRING: "", NUMTURNS: null, NEXTTOMOVE: "", FAMILY: "", CASTLINGBLACK: null, CASTLINGWHITE: null, CHECKMATE: false, COMMON: null, CONTINUATIONSFULL: [], CONTINUATIONSNEXT: [], FAVOURITE: null, ISERROR: null, MOVEOBJ: [], SUBVARIATION: null, VARIATION: null };
const parentELMain = document.querySelector("#main-board-container");



import JSONReader from "./libs/JSONReader.js";
import { Dictionary, ChessDictionary } from "./libs/Dictionary.js";

class ChessOpeningsTest {
  #dictionary;

  constructor() {
    this.#dictionary = new ChessDictionary();
  }

  // Step 1: We read the JSON file of all the openings
  async initDictionary() {
    const filepath = './data/openings_data.json';

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


//==================================================================================



const dictResults1 = chessTest.dictionary.filterID(3184)[0] // Blumenfeld Countergambit
const dictResults2 = chessTest.dictionary.filterID(3186)[0] // Blumenfeld Countergambit: Duz-Khotimirsky Variation
const dictResults3 = chessTest.dictionary.filterID(3185)[0] // Blumenfeld Countergambit Accepted



const dictResults4 = chessTest.dictionary.filterID(2889)[0] // Queen's Gambit Declined: Traditional Variation
const dictResults5 = chessTest.dictionary.filterID(2890)[0] // Queen's Gambit Declined: Vienna Variation




const game = new GameSmall(dictResults1, 1, parentELMain)
// game.render()

await game.updateGameInformation(dictResults1);
// await game.runGameWithParserObject();
game.render();


function countNonMatchingElements(board1, board2) {

    const arr1 = board1.split(" || ");
    const arr2 = board2.split(" || ");
    // Determine the length of the longer array
    const maxLength = Math.max(arr1.length, arr2.length);
    let nonMatchingCount = 0;

    // Loop through the elements of both arrays up to the length of the longer array
    for (let i = 0; i < maxLength; i++) {
        // Compare elements at the same position in both arrays
        if (arr1[i] !== arr2[i]) {
            nonMatchingCount++;
        }
    }

    return nonMatchingCount;
}


const result = countNonMatchingElements(dictResults4["BOARDSTRING"], dictResults5["BOARDSTRING"]);
console.log(result); // Number of differences


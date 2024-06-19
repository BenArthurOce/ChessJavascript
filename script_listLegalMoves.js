
// import FrontPage from "./libs/FrontPageUsingLogic.js";
// import FrontPageUsingFEN from "./libs/FrontPageUsingFEN.js";


import { Game, GameLarge, GameSmall } from "./libs/GameUsingLogic.js";
import { Piece } from "./libs/Piece.js";

const emptyOpening = { ID: null, FEN: "", ECO: "", VOLUME: "", NAME: "", PGN: "", MOVESSTRING: "", NUMTURNS: null, NEXTTOMOVE: "", FAMILY: "", CASTLINGBLACK: null, CASTLINGWHITE: null, CHECKMATE: false, COMMON: null, CONTINUATIONSFULL: [], CONTINUATIONSNEXT: [], FAVOURITE: null, ISERROR: null, MOVEOBJ: [], SUBVARIATION: null, VARIATION: null };
const sample_pgn = "1.Nh3 d5 2.g3 e5 3.f4"
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

///-------------------------------------PRINTS OUT THE FEN OF EACH GAME-------------------------------------


// function isMoveLegal(piece, destination, board) {
//     return piece.isValidMove(destination, board);
// }

// function getLegalMoves(board) {
//     const legalMoves = [];
//     board.forEach((row, rowIndex) => {
//         row.forEach((cell, colIndex) => {
//             if (cell !== null) {
//                 const piece = cell;
//                 const team = piece.team;
//                 for (let i = 0; i < 8; i++) {
//                     for (let j = 0; j < 8; j++) {
//                         if (i !== rowIndex || j !== colIndex) {
//                             const destination = [i, j];
//                             if (isMoveLegal(piece, destination, board)) {
//                                 legalMoves.push({ from: [rowIndex, colIndex], to: destination });
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//     });
//     return legalMoves;
// }


// const pieceClasses = {
//     'p': Pawn, 'r': Rook, 'n': Knight, 'b': Bishop, 'q': Queen, 'k': King,
//     'P': Pawn, 'R': Rook, 'N': Knight, 'B': Bishop, 'Q': Queen, 'K': King
// };



const dictResults = chessTest.dictionary.filterPGN(sample_pgn)
// chessTest.dictionary
// const a = chessTest.filterPGN(sample_pgn)
// console.log(a)
const myTestOpening = dictResults[0]
console.log(myTestOpening)

const game = new GameSmall(myTestOpening, 1, parentELMain)
// game.render()

await game.updateGameInformation(myTestOpening);
// await game.runGameWithParserObject();
game.render();







// // Initialize board with piece objects
// const boardWithPieces = board.map((row, rowIndex) => {
//     return row.map((cell, colIndex) => {
//         if (cell === null) return null;
//         const team = cell === cell.toUpperCase() ? 0 : 1;
//         const pieceClass = pieceClasses[cell.toLowerCase()];
//         const piece = new pieceClass(team);
//         piece.update(rowIndex, colIndex);
//         return piece;
//     });
// });

const legalMoves = game.determineLegalMoves();
console.log(legalMoves);
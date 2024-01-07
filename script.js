// Import statement at the top level
import Board from "./libs/factoryChessBoard.js";
// import {Piece, Pawn, Rook, Knight, Bishop, Queen, King} from "./libs/factoryChessPiece.js";
import Parser from "./libs/factoryChessParser.js";
import Logic from "./libs/factoryChessLogic.js";
import {Piece, Pawn, Rook, Knight, Bishop, Queen, King} from "./libs/factoryChessPiece.js";

import HTMLBoard from "./libs/HTMLChessBoard.js";


import ChessUtility from "./libs/factoryChessUtility.js";

import OpeningDatabase from "./libs/factoryOpeningDatabase.js";


//https://github.com/lichess-org/chess-openings/blob/master/a.tsv
//https://raw.githubusercontent.com/lichess-org/chess-openings/master/a.tsv
const a = `1. e4 e6 2. d4 d5 3. Nd2 Nf6 4. e5 Nfd7 5. Bd3 c5 6. c3 Nc6 7. Ne2 cxd4`
const b = '1.d4 Nf6 2.c4 c5 3.d5 b5'
const c = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O c4`
const d = `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Ne7 7. Qg4 Qc7 8. Qxg7 Rg8 9. Qxh7 cxd4 10. Kd1`
const e = '1.d4 Nf6 2.c4 c5 3.R4a6 b5'
const f = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O c4`
const g = `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Ne7 7. Qg4 Qc7 8. Qxg7 Rg8 9. Qxh7 cxd4`
const h = `1. c4 e6 2. Nf3 c5 3. Nc3 Nf6 4. g3 b6 5. Bg2 Bb7 6. O-O Be7 7. d4 cxd4 8. Qxd4 d6 9. Rd1 a6 10. b3 Nbd7`
const i = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7`
const j = `1. e4 e6 2. d4 d5 3. Bg5 Be7 5. e5 a6`
const k = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 a6`
const l = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O O-O`
const m = `1. Nh3 d5 2. g3 e5 3. f4 Bxh3 4. Bxh3 exf4`
const n = `1. d4 Nf6 2. c4 c5 3. d5 b5 4. cxb5 a6 5. bxa6 g6 6. Nc3 Bxa6 7. Nf3 d6 8. e4 Bxf1 9. Kxf1 Bg7 10. g3 O-O 11. Kg2`
const o = `1. d4 Nf6 2. c4 e6 3. g3 c5 4. d5 exd5 5. cxd5 d6 6. Nc3 g6 7. Bg2 Bg7 8. Nf3 O-O 9. O-O a6 10. a4 Nbd7 11. Nd2 Re8`
const p = `1. d4 Nf6 2. c4 c5 3. d5 e6 4. Nc3 exd5 5. cxd5 d6 6. e4 g6 7. Nf3 Bg7 8. Be2 O-O 9. O-O Re8 10. Nd2 Na6 11. f3 a5`
const q = `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+`
const bad = `1. e4 e6 2. d1 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+`

// const openings = [a, b, c, f, h, i, j, k, l, m, n]
const myOpenings = [a, bad, c, f, h, i, j, k, m, n]



//
// ALLOWS MULTIPLE CHESSBOARDS TO RENDER SAME TIME
//
async function processAllLogicMoves(logic) {
    logic.processAllMoves();
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function processMovesAsync(logic) {
    // Asynchronous logic (if needed)
    await delay(2000); // Wait for 2000 milliseconds (2 seconds)
    
    // Synchronous logic
    logic.processAllMoves();
};

function renderAsync(chessHTML, boardState) {
    return new Promise(resolve => {
        // Asynchronous rendering logic (if needed)
        requestAnimationFrame(() => {
            chessHTML.render(boardState);
            resolve();
        });
    });
};


//
// RENDERS EACH CHESSBOARD
//
myOpenings.forEach(async (opening) => {

    try {
        const newLogic = new Logic(opening);
        await processMovesAsync(newLogic);

        const chessHTML = new HTMLBoard(100, 100);
        document.body.querySelector("#side-board-containers").appendChild(chessHTML.element);

        // Asynchronously render the chessboard
        await renderAsync(chessHTML, newLogic.gameBoard.grid);
    } catch (error) {
        // console.error(`Error processing opening: ${opening}`, error);
        console.error(error);

        // If there's an error, create a standard chessboard
        const standardChessHTML = new HTMLBoard(100, 100);
        document.body.querySelector("#side-board-containers").appendChild(standardChessHTML.element);

        const standardBoardState = new Board();

        // Asynchronously render the standard chessboard
        await renderAsync(standardChessHTML, standardBoardState.grid);
    }
});


// Create an additional chessboard outside the loop
const additionalLogic = new Logic(p); // Example opening
await processMovesAsync(additionalLogic);

const additionalChessHTML = new HTMLBoard(100, 100);
document.body.querySelector("#main-board-container").appendChild(additionalChessHTML.element);
additionalChessHTML.render(additionalLogic.gameBoard.grid);


//
// WIP - Database of openings
//

  // Create an instance of OpeningDatabase
  const openingDB = new OpeningDatabase();

  // Log openings after the class is initialized
  openingDB.initClass();

  // Alternatively, if you want to log openings after a delay (for demonstration purposes)
  setTimeout(() => {
    console.log(openingDB.openings);
  }, 2000); // Adjust the delay as needed
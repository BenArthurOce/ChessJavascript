// Import statement at the top level
import Board from "./libs/factoryChessBoard.js";
// import {Piece, Pawn, Rook, Knight, Bishop, Queen, King} from "./libs/factoryChessPiece.js";
import Parser from "./libs/factoryChessParser.js";
import Logic from "./libs/factoryChessLogic.js";
import {Piece, Pawn, Rook, Knight, Bishop, Queen, King} from "./libs/factoryChessPiece.js";

import HTMLBoard from "./libs/HTMLChessBoard.js";


//https://github.com/lichess-org/chess-openings/blob/master/a.tsv
//https://raw.githubusercontent.com/lichess-org/chess-openings/master/a.tsv
const a = `1. e4 e6 2. d4 d5 3. Nd2 Nf6 4. e5 Nfd7 5. Bd3 c5 6. c3 Nc6 7. Ne2 cxd4`
const b = '1.d4 Nf6 2.c4 c5 3.d5 b5'
const c = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O c4`
const d = `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Ne7 7. Qg4 Qc7 8. Qxg7 Rg8 9. Qxh7 cxd4 10. Kd1`
const e = '1.d4 Nf6 2.c4 c5 3.R4a6 b5'
const f = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O c4`
const g = `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Ne7 7. Qg4 Qc7 8. Qxg7 Rg8 9. Qxh7 cxd4`
const h = `1. Bg5 e6`
const i = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7`
const j = `1. e4 e6 2. d4 d5 3. Bg5 Be7 5. e5 a6`
const k = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 a6`
const l = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O O-O`
const m = `1. Nh3 d5 2. g3 e5 3. f4 Bxh3 4. Bxh3 exf4`
const n = `1. d4 Nf6 2. c4 c5 3. d5 b5 4. cxb5 a6 5. bxa6 g6 6. Nc3 Bxa6 7. Nf3 d6 8. e4 Bxf1 9. Kxf1 Bg7 10. g3 O-O 11. Kg2`
const o = `1. d4 Nf6 2. c4 e6 3. g3 c5 4. d5 exd5 5. cxd5 d6 6. Nc3 g6 7. Bg2 Bg7 8. Nf3 O-O 9. O-O a6 10. a4 Nbd7 11. Nd2 Re8`
const p = `1. d4 Nf6 2. c4 c5 3. d5 e6 4. Nc3 exd5 5. cxd5 d6 6. e4 g6 7. Nf3 Bg7 8. Be2 O-O 9. O-O Re8 10. Nd2 Na6 11. f3 a5`


const newLogic = new Logic(p) // Logic Contains the Board, the Parser and the logic to find pieces
// The argument that Logic takes is a PGN string


newLogic.processMoves()
newLogic.gameBoard.printToTerminal()

// Create an instance of HTMLBoard
const chessHTML = new HTMLBoard();

// Display the chessboard on the page
document.body.appendChild(chessHTML.element);

// After Logic has ran, render the board state to the webpage
chessHTML.render(newLogic.gameBoard.grid)

// const test1 = newLogic.gameBoard.filterBoardByAttribute("p", "team", 0)
// console.log(test1)


// const board2 = new Board()
// // const aaa = board2.getSquareArray()
// // console.log(aaa)

// const piece = board2.returnPieceFromRef("a1")
// const result = piece.isValidMove([3, 0])
// console.log(result)

// console.log(board2.returnPieceFromRef("a1"))
// console.log()






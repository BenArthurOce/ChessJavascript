// Import statement at the top level
import Board from "./libs/factoryChessBoard.js";
// import {Piece, Pawn, Rook, Knight, Bishop, Queen, King} from "./libs/factoryChessPiece.js";
import Parser from "./libs/factoryChessParser.js";
import Logic from "./libs/factoryChessLogic.js";
import {Piece, Pawn, Rook, Knight, Bishop, Queen, King} from "./libs/factoryChessPiece.js";



//https://github.com/lichess-org/chess-openings

// const newBoard = new Board();
// newBoard.initSquares();
// newBoard.initPieces();



// console.log(newBoard.grid);

// console.log(newBoard.returnPieceFromBoardPosition(2, 2))



// // Demonstration of removing piece
// newBoard.removePieceFromBoard(1,1)
// newBoard.printToTerminal()


// const newPiece = newBoard.returnPieceFromBoardPosition(1,5)
// // console.log(newPiece)

// // ToDo:
// // find piece based on action
// // The action will be the user moving the piece?

// // 

// const aaaa = newBoard.returnPieceFromBoardReference("f8");
// // console.log(aaaa)



// // const newParse = new Parser('1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5')
// // console.log(newParse)








// const teststring = testBoard.printToTerminal()


// //This "flattens an array"
// const testBoard = new Board

// const aaaaaa = testBoard.getFlatGrid()
// console.log(aaaaaa)


// console.log(testBoard)

// const testLogic2 = new Logic

const myBoard = new Board()
const myarray = myBoard.getPieceArray()
// console.log(myarray)






// if (piece instanceof Piece == false) {

// Filters entire board by rooks
// console.log(myBoard.filterBoardByPeice(Queen, 1))   // Filters by rooks






// // Find a piece and get its legal moves
// console.log(myBoard.returnPieceFromBoardReference("b2").findLegalMoves())


// console.log(newLogic.findLocation())


// const newLogic = new Logic('1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5')

// const newLogic = new Logic('1.a4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5')

const a = `1. e4 e6 2. d4 d5 3. Nd2 Nf6 4. e5 Nfd7 5. Bd3 c5 6. c3 Nc6 7. Ne2 cxd4`
const b = '1.d4 Nf6 2.c4 c5 3.d5 b5'
const c = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O c4`
const d = `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Ne7 7. Qg4 Qc7 8. Qxg7 Rg8 9. Qxh7 cxd4 10. Kd1`
const e = '1.d4 Nf6 2.c4 c5 3.R4a6 b5'
const f = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O c4`
const g = `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Ne7 7. Qg4 Qc7 8. Qxg7 Rg8 9. Qxh7 cxd4`

const newLogic = new Logic(g)
// newLogic.gameBoard.printToTerminal()

newLogic.processMoves()
newLogic.gameBoard.printToTerminal()




// const newBoard1 = new Board()
// newBoard1.deletePieceFromRef("a2")
// newBoard1.printToTerminal()


import { MoveValidationStrategy, PawnMoveStrategy, RookMoveStrategy, KnightMoveStrategy, BishopMoveStrategy, QueenMoveStrategy, KingMoveStrategy } from "./PatternMoveStrategy/MoveValidationStrategy.js";
import {Piece, Pawn, Rook, Knight, Bishop, Queen, King} from "./PatternMoveStrategy/PieceOLD.js";

// // Usage example
// let whitePawn = new Piece(0, new PawnMoveStrategy());
// let blackRook = new Piece(1, new RookMoveStrategy());

// let destination = [4, 4]; // Example destination square
// let moveInfo = {}; // Example move information object

// // Validate moves
// console.log('Is valid move for white pawn?', whitePawn.isValidMove(destination, moveInfo)); // Example output
// console.log('Is valid move for black rook?', blackRook.isValidMove(destination, moveInfo)); // Example output



// Usage example
// let whitePawn = new Pawn(0);
let blackRook = new Rook(1);
let whiteKnight = new Knight(0);
let blackBishop = new Bishop(1);
let whiteQueen = new Queen(0);
let blackKing = new King(1);

let destination = [4, 4]; // Example destination square
let moveInfo = {}; // Example move information object

// Validate moves
// console.log('Is valid move for white pawn?', whitePawn.isValidMove(destination, moveInfo)); // Example output
console.log('Is valid move for black rook?', blackRook.isValidMove(destination, moveInfo)); // Example output
console.log('Is valid move for white knight?', whiteKnight.isValidMove(destination, moveInfo)); // Example output
console.log('Is valid move for black bishop?', blackBishop.isValidMove(destination, moveInfo)); // Example output
console.log('Is valid move for white queen?', whiteQueen.isValidMove(destination, moveInfo)); // Example output
console.log('Is valid move for black king?', blackKing.isValidMove(destination, moveInfo)); // Example output
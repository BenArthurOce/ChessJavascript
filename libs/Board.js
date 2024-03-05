import ChessUtility from './StaticChessUtility.js';
import ErrorCheck from './StaticErrorCheck.js';
import {Piece, Pawn, Rook, Knight, Bishop, Queen, King, HTMLPiece} from "./Piece.js";

import { Square, SquareFactory, SquareHTML } from './Square.js';


class Board {
    #className;
    #objectType
    #grid
    constructor() {
        this.#className = "Board"; 
        this.#objectType = null;  
    };
    get className() {
        return this.#className;
    };
    get objectType() {
        return this.#objectType;
    };
    set objectType(value) {
        this.#objectType = value;
    };
    get grid() {
        return this.#grid;
    };
    set grid(value) {
        this.#grid = value;
    };

    createBoardElement() {
        if (this.objectType === "DOM") {
            this.element = document.createElement('div');
            this.element.className = "chessboard"
        };
    };

    initSquares() {
        if (this.objectType === "Factory") {
            this.grid = Array.from({ length: 8 }, (_, row) =>
                Array.from({ length: 8 }, (_, col) => new SquareFactory(row, col))
            );
        };
        if (this.objectType === "DOM") {
            this.grid = Array.from({ length: 8 }, (_, row) =>
                Array.from({ length: 8 }, (_, col) => new SquareHTML(row, col, this.element))
            );
        };
    };

    addToDOM() {
        if (this.objectType === "DOM") {
            this.parentElement.appendChild(this.element)
        };
    };


    /**
     * Initializes the pieces on the board.
     * 
     */
    initPieces() {
        // Create Chess Pieces and place on board - White
        this.putPieceFromRef(new Rook(0), "a1");
        this.putPieceFromRef(new Knight(0), "b1");
        this.putPieceFromRef(new Bishop(0), "c1");
        this.putPieceFromRef(new Queen(0), "d1");
        this.putPieceFromRef(new King(0), "e1");
        this.putPieceFromRef(new Bishop(0), "f1");
        this.putPieceFromRef(new Knight(0), "g1");
        this.putPieceFromRef(new Rook(0), "h1");

        this.putPieceFromRef(new Pawn(0), "a2");
        this.putPieceFromRef(new Pawn(0), "b2");
        this.putPieceFromRef(new Pawn(0), "c2");
        this.putPieceFromRef(new Pawn(0), "d2");
        this.putPieceFromRef(new Pawn(0), "e2");
        this.putPieceFromRef(new Pawn(0), "f2");
        this.putPieceFromRef(new Pawn(0), "g2");
        this.putPieceFromRef(new Pawn(0), "h2");
        
        // Create Chess Pieces and place on board - Black
        this.putPieceFromRef(new Rook(1), "a8");
        this.putPieceFromRef(new Knight(1), "b8");
        this.putPieceFromRef(new Bishop(1), "c8");
        this.putPieceFromRef(new Queen(1), "d8");
        this.putPieceFromRef(new King(1), "e8");
        this.putPieceFromRef(new Bishop(1), "f8");
        this.putPieceFromRef(new Knight(1), "g8");
        this.putPieceFromRef(new Rook(1), "h8");

        this.putPieceFromRef(new Pawn(1), "a7");
        this.putPieceFromRef(new Pawn(1), "b7");
        this.putPieceFromRef(new Pawn(1), "c7");
        this.putPieceFromRef(new Pawn(1), "d7");
        this.putPieceFromRef(new Pawn(1), "e7");
        this.putPieceFromRef(new Pawn(1), "f7");
        this.putPieceFromRef(new Pawn(1), "g7");
        this.putPieceFromRef(new Pawn(1), "h7");
    };


    /**
     * Returns a square on the chessboard by looking up its 2 character string reference
     * 
     * @param {string} ref The position reference of the square ie: "a5".
     * @returns {SquareFactory} The SquareFactory() object.
     */
    returnSquare(ref) {
        ErrorCheck.validateCellRef(ref);
        return this.grid.flat().find(square => square.positionRef === ref);
    };


    /**
     * Gets the two squares, deletes the piece from one, adds piece to the other
     * 
     * @param {Piece} pieceToMove Piece() object that is to be moved
     * @param {string} refTarget 2 character string of the destination square reference
     */
    movePiece(pieceToMove, refTarget) {
        // Check if everything is good
        ErrorCheck.validateIsChessPiece(pieceToMove)
        ErrorCheck.validateCellRef(refTarget)

        // Move piece
        this.returnSquare(pieceToMove.positionRef).clearPiece()
        this.returnSquare(refTarget).setPiece(pieceToMove)
    };


    /**
     * Places piece on chessboard. Used for the opening function. Could be removed?
     * 
     * @param {Piece} piece Piece() object that is to be moved
     * @param {string} refTarget 2 character string of the destination square reference that the peice is to be added to
     */
    putPieceFromRef(piece, refTarget) {
        ErrorCheck.validateCellRef(refTarget);
        this.returnSquare(refTarget).setPiece(piece)
    };


    /**
     * Get a 2d array of the Chessboard, with each element displaying a selected attribute of the Piece() object
     *
     * @param {string} attribute The attribute to retrieve for each piece.
     * @param {string} ifNull The value to use if the square doesn't contain a piece.
     * @returns {Array<Array<string>>} The 2d array representing the specified attribute for each piece on the board.
     */
    getArray(attribute, ifNull) {
        console.log("getArray")
        return this.grid.map(row =>
            row.map(square => (square.piece instanceof Piece ? square.piece[attribute] : ifNull))
        );
    };


    /**
     * Performs Castling, where the Rook and the King/Queen both move at the same time.
     * 
     * @param {string} teamNum Team Number. 0 = White, 1 = Black
     * @param {string} castlingSide The type of castling. Either "Kingside" or "Queenside"
     */
    performCastling(teamNum, castlingSide) {
        ErrorCheck.validateTeamNumber(teamNum);
        ErrorCheck.validateCastlingCommand(castlingSide);

        const key = `${teamNum}_${castlingSide}`;
        const castlingInstructions = {
             "0_Kingside":  {kingFrom: "e1", kingTo: "g1", rookFrom: "h1", rookTo: "f1"}
            ,"1_Kingside":  {kingFrom: "e8", kingTo: "g8", rookFrom: "h8", rookTo: "f8"}
            ,"0_Queenside": {kingFrom: "e1", kingTo: "c1", rookFrom: "a1", rookTo: "d1"}
            ,"1_Queenside": {kingFrom: "e8", kingTo: "c8", rookFrom: "a8", rookTo: "d8"}
        };
        const moves = castlingInstructions[key]

        ErrorCheck.validateContents(this.returnSquare(moves.kingFrom), King);
        ErrorCheck.validateContents(this.returnSquare(moves.rookFrom), Rook);

        const king = this.returnSquare(moves.kingFrom).piece;
        const rook = this.returnSquare(moves.rookFrom).piece;
        this.movePiece(king, moves.kingTo);
        this.movePiece(rook, moves.rookTo);
    };


    // Return a list of pieces that match criteria
    filterBoardByAttribute(code, attributeName, attributeValue) {
        const array = this.grid.map(row =>
            row.map(square => (square.piece instanceof Piece ? square.piece : null))
        ).flat();
        return array
            .filter(piece => piece && piece.pieceCodeStr === code)
            .filter(piece => piece[attributeName] === attributeValue);
    };


    /**
     * Print the current board state to the terminal
     */
    printToTerminal() {

        const positionArray = this.getArray("code", "--")
        
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const nums = [7, 6, 5, 4, 3, 2, 1, 0];
      
        let board = '\n';
        board += '  │  0 │  1 │  2 │  3 │  4 │  5 │  6 │  7 │\t  │  a │  b │  c │  d │  e │  f │  g │  h │\n';

      
        for (let rank = 7; rank >= 0; rank--) {
            board += `──│────│────│────│────│────│────│────│────│\t──│────│────│────│────│────│────│────│────│\n`;
            board += `${nums[rank]} │`;

            for (let file of files) {
                const piece = positionArray[7 - rank][files.indexOf(file)];
                board += ` ${piece === '' ? '{}' : piece} │`;
            };

            board += '\t';

            let swapNum = ChessUtility.rowArrayToRef(nums[rank])

            board += `${swapNum} │`;

            for (let file of files) {
                let piece = positionArray[7 - rank][files.indexOf(file)];
                board += ` ${piece === '' ? '{}' : piece} │`;
            };

            board += '\n';
        };
      
        board += `──│────│────│────│────│────│────│────│────│\t──│────│────│────│────│────│────│────│────│\n`;
      
        console.log(board);
      };


    /**
     * Prints a grid of all the chess squares (and their 2 character string reference) to the terminal
     */
    printSquaresToTerminal() {

        const positionArray = this.grid.map(row =>
            row.map(square => (square instanceof SquareFactory ? square.positionRef : "--"))
        );

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const nums = [7, 6, 5, 4, 3, 2, 1, 0];
      
        let board = '\n';
      
        for (let rank = 7; rank >= 0; rank--) {
            board += `──│────│────│────│────│────│────│────│────│\n`;
            board += `${nums[rank]} │`;
        
            for (let file of files) {
                const piece = positionArray[7 - rank][files.indexOf(file)];
                board += ` ${piece === '' ? '{}' : piece} │`;
            };
        
            board += '\n';
        };
      
        board += `──│────│────│────│────│────│────│────│────│\n`;
        board += '  │  0 │  1 │  2 │  3 │  4 │  5 │  6 │  7 │\n';
      
        console.log(board);
    };

};


class BoardFactory extends Board {
    constructor() {
        super()
        this.objectType = "Factory"
        this.createBoardElement();
        this.initSquares()
        this.initPieces()
        this.addToDOM()
    };
};


class BoardHTML extends Board {
    #parentElement;
    #element;
    constructor(parentElement) {
        super()
        this.objectType = "DOM";
        this.#parentElement = parentElement;
        this.#element = null;
        this.createBoardElement();
        this.initSquares();
        this.addToDOM()
    };
    get parentElement() {
        return this.#parentElement;
    };
    set parentElement(value) {
        this.#parentElement = value;
    };
    get element() {
        return this.#element;
    };
    set element(value) {
        this.#element = value;
    };
};

export {Board, BoardFactory, BoardHTML}
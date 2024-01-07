import ChessUtility from './factoryChessUtility.js';
import { Piece } from './factoryChessPiece.js';

class Square {
    #row;
    #col;
    #fileRef;
    #rankRef;
    #positionRef;
    #positionArr
    #contains;
    constructor(row, col) {
        if ((row > 7) || (col > 7)) {throw new Error("Cell invalid range")};
        this.#row = row;                                //Base 0 - row position in grid
        this.#col = col;                                //Base 0 - col position in grid
        this.#rankRef = ChessUtility.rowArrayToRef(row)    //Base 1 - row position in grid    
        this.#fileRef = ChessUtility.colArrayToRef(col)    //col position converted to letter
        this.#positionRef = this.#fileRef + this.#rankRef;            //notational "a1" cell reference
        this.#positionArr = [row, col]                  // grid index location of square
        this.#contains = null;                          //indicates if a Piece() is on the Square() object
    };
    get row() {
        return this.#row;
    };
    get col() {
        return this.#col;
    };
    get fileRef() {
        return this.#fileRef;
    };
    get rankRef() {
        return this.#rankRef;
    };
    get positionRef() {
        return this.#positionRef;
    };
    get positionArr() {
        return this.#positionArr;
    };
    get contains() {
        return this.#contains;
    };
    set contains(piece) {
        this.#contains = piece;
    };
    get piece() {
        return this.#contains;
    }
    clearPiece() {
        this.#contains = null;
    }
    setPiece(piece) {
        piece.update(this)
        this.#contains = piece;
    }
};

export default Square;
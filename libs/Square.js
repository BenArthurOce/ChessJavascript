import ChessUtility from './StaticChessUtility.js';

class Square {
    #className;
    #objectType
    #row;
    #col;
    #fileRef;
    #rankRef;
    #positionRef;
    #positionArr
    #contents;
    constructor(row, col) {
        this.#className = "Square"
        this.#objectType = null;                                // Either a Factory or DOM object
        this.#row = row;                                        // base 0 - row position in grid
        this.#col = col;                                        // base 0 - col position in grid
        this.#rankRef = ChessUtility.rowArrayToRef(row)         // base 1 - row position in grid    
        this.#fileRef = ChessUtility.colArrayToRef(col)         // col position converted to letter
        this.#positionRef = this.#fileRef + this.#rankRef;      // notational two character square reference (ie: a1)
        this.#positionArr = [row, col]                          // two element array of row and col (base 0)
        this.#contents = null;                                  // indicates if a Piece() is on the Square() object
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
    get row() {
        return this.#row;
    };
    get col() {
        return this.#col;
    };
    get rankRef() {
        return this.#rankRef;
    };
    get fileRef() {
        return this.#fileRef;
    };
    get positionRef() {
        return this.#positionRef;
    };
    get positionArr() {
        return this.#positionArr;
    };
    get contents() {
        return this.#contents;
    };
    set contents(piece) {
        this.#contents = piece;
    };
    get piece() {
        return this.#contents;
    };
    clearPiece() {
        this.#contents = null;
    };
    setPiece(piece) {
        piece.update(this)
        this.#contents = piece;
    };
    removePiece() {
        this.#contents = null;
    };

};


class SquareFactory extends Square {

    constructor(row, col) {
        super(row, col);
        this.objectType = "Factory"
    };
};


class SquareHTML extends Square {
    #row;
    #col;
    #parentElement;
    #element;
    constructor(row, col, parentElement) {
        super(row, col)
        this.#row = row;
        this.#col = col;
        this.#parentElement = parentElement;
        this.objectType = "DOM"
        this.element = null
        this.createHTMLElement()
    };
    get parentElement() {
        return this.#parentElement;
    };
    set parentElement(value) {
        this.#parentElement = value
    };
    get element() {
        return this.#element;
    };
    set element(value) {
        this.#element = value
    };

    createHTMLElement() {
        this.element = document.createElement('div');
        this.element.className = (this.row + this.col) % 2 === 0 ? "lightSquare square" : "darkSquare square";
        this.element.dataset.row = this.row;
        this.element.dataset.col = this.col;
        this.parentElement.appendChild(this.element)
    };

    setPiece(piece) {
        if (piece === null) {
            // while statement ensures that every child element is removed
            while (this.element.firstChild) {
                this.element.removeChild(this.element.firstChild);
            }
        } else {
            // If piece is not null, append the piece element
            this.element.appendChild(piece.element);
        }
    }


};

export {Square, SquareFactory, SquareHTML};
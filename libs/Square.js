import StaticChessUtility from './StaticChessUtility.js';

/*
The Square() object are the squares that make up the chessboard
Some of these Square() objects contain Piece() objects, and are stored in the "contents" attribute of the square
It is the Square responsibility to ensure that the Piece() is updated with the correct information
*/

class Square {
    #parentElement;     // Object that contains this object, in this case, its Board()
    #element;           // This DOM element
    #className;         // Name of this class
    #row;               // base 0 - row position in grid
    #col;               // base 0 - col position in grid
    #fileRef;           // col position converted to letter
    #rankRef;           // base 1 - row position in grid 
    #positionRef;       // notational two character square reference (ie: a1)
    #positionArr;       // two element array of row and col (base 0)
    #contents;          // Either null, or a Piece() object

    constructor(row, col, parentElement) {
        this.#parentElement = parentElement;
        this.#element = document.createElement('div');
        this.#className = "Square";
        this.#row = row;
        this.#col = col;
        this.#rankRef = StaticChessUtility.rowArrayToRef(row);
        this.#fileRef = StaticChessUtility.colArrayToRef(col);
        this.#positionRef = this.#fileRef + this.#rankRef;
        this.#positionArr = [row, col];
        this.#contents = null;
        this.init() //createHTMLElement
    };
    get parentElement() {
        return this.#parentElement;
    };
    get element() {
        return this.#element;
    };
    get className() {
        return this.#className;
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
    init() {
        this.createHTMLElement()
    };
    toggleActivated() {
        this.element.classList.toggle("activeSquare");
    };


    /**
     * Creates a Square() HTML object for the DOM
     */
    createHTMLElement() {
        if (this.parentElement===null) {return}
        this.element.className = (this.row + this.col) % 2 === 0 ? "lightSquare square" : "darkSquare square";
        this.element.dataset.row = this.row;
        this.element.dataset.col = this.col;
        this.parentElement.appendChild(this.element)
    };


    /**
     * Updates the #contents attribute of the Square() object with the Piece() object that is on that square. Also updates the DOM
     * @param {Piece} pieceObj The Square() object where the Piece() object is residing
     */
    setPiece(pieceObj) {
        pieceObj.update(this);       
        this.#contents = pieceObj;
        if (this.parentElement===null) {return}
        this.element.appendChild(pieceObj.element)
    };

    
    /**
     * clearContents - WIP
     */
    clearContents() {
        this.#contents = null;
        this.#element.innerHTML = '';
    };


    /**
     * Print debugging information about the Square() object
     */
    printToTerminal() {
        console.log(`------Debug ${this.className} Details------`)
        console.log(`Row: ${this.row} | Col: ${this.col} | positionRef: ${this.positionRef} | positionArr: ${this.positionArr}`)
        console.log(`row: ${this.row} | col: ${this.col} | fileRef: ${this.fileRef} | rankRef: ${this.rankRef}`)
        console.log(`-----------------------`)

        if (this.contents === null) {return}
        console.log(`*******Square Contents*******`)
        this.contents.printToTerminal()
    };
};

export default Square;

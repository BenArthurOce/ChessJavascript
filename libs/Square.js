import StaticChessUtility from './StaticChessUtility.js';

class Square {
    #parentElement;
    #element;
    #className;
    #row;
    #col;
    #fileRef;
    #rankRef;
    #positionRef;
    #positionArr;
    #contents;
    constructor(row, col, parentElement) {
        this.#parentElement = parentElement;
        this.#element = document.createElement('div');
        this.#className = "Square";
        this.#row = row;                                        // base 0 - row position in grid
        this.#col = col;                                        // base 0 - col position in grid
        this.#rankRef = StaticChessUtility.rowArrayToRef(row);  // base 1 - row position in grid   
        this.#fileRef = StaticChessUtility.colArrayToRef(col);  // col position converted to letter
        this.#positionRef = this.#fileRef + this.#rankRef;      // notational two character square reference (ie: a1)
        this.#positionArr = [row, col];                         // two element array of row and col (base 0)
        this.#contents = null;                                  // indicates if a Piece() is on the Square() object
        this.init()
    };
    get parentElement() {
        return this.#parentElement;
    };
    get element() {
        return this.#element;
    };
    set element(value) {
        this.#element = value;
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

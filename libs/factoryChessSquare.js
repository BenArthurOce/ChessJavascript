class Square {
    #row;
    #col;
    #colour;
    #file;
    #rank;
    #pos;
    #contains;
    constructor(row, col, colour) {
        if ((row > 7) || (col > 7)) {throw new Error("Cell invalid range")};
        this.#row = row;                         //Base 0 - row position in grid
        this.#col = col;                         //Base 0 - col position in grid
        this.#colour = colour;                   //light or dark - WIP
        this.#rank = row + 1;                    //Base 1 - row position in grid    
        this.#file = (col + 10).toString(36);    //col position converted to letter
        this.#pos = this.#file + this.#rank;     //notational "a1" cell reference
        this.#contains = null;                   //indicates if a Piece() is on the Square() object
    };
    get row() {
        return this.#row;
    };
    get col() {
        return this.#col;
    };
    get colour() {
        return this.#colour;
    };
    set colour(value) {
        this.#colour = value;
    };
    get file() {
        return this.#file;
    };
    get rank() {
        return this.#rank;
    };
    get pos() {
        return this.#pos;
    };
    get contains() {
        return this.#contains;
    };
    set contains(piece) {
        this.#contains = piece;
    };
};

export default Square;
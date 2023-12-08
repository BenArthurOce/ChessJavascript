class HTMLSquare {
    #row;
    #col;
    #colour;
    #element
  
    constructor(row, col, colour) {
        this.#row = row;
        this.#col = col;
        this.#colour = colour;
        this.#element = null;
        this.createHTMLElement()
    };
  
    get row() {
        return this.#row;
    };

    get col() {
        return this.#col;
    };
  
    get color() {
      return this.#colour;
    };

    get element() {
        return this.#element;
    };

    set element(value) {
        this.#element = value
    }

    createHTMLElement() {
        this.element = document.createElement('div');
        this.piece = document.createElement('img');

        this.element.className = (this.row + this.col) % 2 === 0 ? "lightSquare" : "darkSquare";

        this.element.dataset.row = this.row;
        this.element.dataset.col = this.col;
        this.element.dataset.piece = this.piece
    };


    setPiece(piece) {
        if (piece === null) {throw new Error("No piece defined when rendering to DOM")}
        this.element.appendChild(piece)
    };

    removePiece() {
        if (this.piece) {
            this.element.removeChild(this.piece.element);
            this.piece = null;
        };
    };
};
  
export default HTMLSquare;
  

import HTMLSquare from "./HTMLChessSquare.js";
import HTMLPiece from "./HTMLChessPiece.js"

class HTMLBoard {
    #grid;
    #colours;
    #element;
    #width;
    #height;
    #template;
    constructor(width, height) {
        this.#grid = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.#colours = ["#769656", "#eeeed2"];
        this.createHTMLElement();
        this.#width = width;
        this.#height = height;
        this.#template = `<div class="chessboard"></div>`
    };
    get grid() {
        return this.#grid;
    };
    get colours() {
        return this.#colours;
    };
    set colours(value) {
        this.#colours = value;
    };
    get element() {
        return this.#element;
    };
    set element(value) {
        this.#element = value;
    };
    get width() {
        return this.#width;
    };
    set width(value) {
        this.#width = value;
    };
    get height() {
        return this.#height;
    };
    set height(value) {
        this.#height = value;
    };
    get template() {
        return this.#template;
    };
    set template(value) {
        this.#template = value;
    };

    // createHTMLElement() {
    //     const newElement = document.createElement("div")
    //     newElement.innerHTML = this.template
    //     const node = newElement.firstChild
    //     document.body.appendChild(node)
    // };

    // To do: Code clean up
    // Create a HTML element from the string. Don't do anything beyond that
    // Then, in "Render()", create the squares and append to the chess board

    // getRefArray() {
    //     return this.grid.map(row =>
    //         row.map(square => (square.contains instanceof Piece ? square.contains.code : null))
    //     );
    // };



    createHTMLElement() {
        this.element = document.createElement('div');
        this.element.className = 'chessboard';
        // this.element.style.width = `${this.width}px`;
        // this.element.style.height = `${this.height}px`;

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const colour = (row + col) % 2 === 0 ? this.colours[0] : this.colours[1];
                const square = new HTMLSquare(row, col, colour);
                this.element.appendChild(square.element);
                this.grid[row][col] = square;
            };
        };
    };

    resizeBoard(rows, cols) {
        this.#grid = new Array(rows).fill(null).map(() => new Array(cols).fill(null));
        this.createHTMLElement();
    };

    changeColors(newColours) {
        this.colours = newColours;
        this.createHTMLElement();
    };

    render(gridArray) {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const gridSquare = gridArray[row][col];

                if (gridSquare.contains !== null && gridSquare.contains.code !== null) {
                    const code = gridSquare.contains.code;
                    const piece = new HTMLPiece(row, col, code);
                    this.grid[row][col].setPiece(piece.element);
                };
            };
        };
    };
};

export default HTMLBoard;




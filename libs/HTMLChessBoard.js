
import HTMLSquare from "./HTMLChessSquare.js";
import HTMLPiece from "./HTMLChessPiece.js"


class HTMLBoard {
    #grid;
    // #rows;
    // #cols;
    #colours;
    #element;

    constructor() {
        this.#grid = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.#colours = ["#769656","#eeeed2"];
        this.createChessboard();
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

    createChessboard() {
        this.element = document.createElement('div');
        this.element.className = 'chessboard';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const colour = (row + col) % 2 === 0 ? this.colours[0] : this.colours[1];
                const square = new HTMLSquare(row, col, colour);
                this.element.appendChild(square.element);
                this.#grid[row][col] = square;
            };
        };
    };

    render(gridArray) {
    
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const gridSquare = gridArray[row][col];
    
                if (gridSquare.contains !== null && gridSquare.contains.code !== null) {
                    const code = gridSquare.contains.code;
                    const piece = new HTMLPiece(row, col, code);
                    this.#grid[row][col].setPiece(piece.element);
                }
            };
        };
    };
};

export default HTMLBoard;
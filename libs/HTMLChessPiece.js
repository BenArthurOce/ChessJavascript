
// https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces#/media/File:Chess_kdt45.svg


class HTMLPiece {
    #row;
    #col;
    #element;
    constructor(row, col, name) {  
        this.#row = row;
        this.#col = col;
        this.#element = null;
        this.createHTMLElement(name);
    };
    get row() {
        return this.#row;
    };
    get col() {
        return this.#col;
    };        
    get element() {
        return this.#element;
    };
    set element(value) {
        this.#element = value;
    };

    createHTMLElement(name) {
        const piecesDirectory = "pieces/";
        const fileMap = new Map();
        fileMap.set("0p", piecesDirectory + "white_pawn.png");
        fileMap.set("1p", piecesDirectory + "black_pawn.png");
        fileMap.set("0R", piecesDirectory + "white_rook.png");
        fileMap.set("1R", piecesDirectory + "black_rook.png");
        fileMap.set("0N", piecesDirectory + "white_knight.png");
        fileMap.set("1N", piecesDirectory + "black_knight.png");
        fileMap.set("0B", piecesDirectory + "white_bishop.png");
        fileMap.set("1B", piecesDirectory + "black_bishop.png");
        fileMap.set("0Q", piecesDirectory + "white_queen.png");
        fileMap.set("1Q", piecesDirectory + "black_queen.png");
        fileMap.set("0K", piecesDirectory + "white_king.png");
        fileMap.set("1K", piecesDirectory + "black_king.png");

        this.element = document.createElement('img');
        this.element.src = fileMap.get(name);
        this.element.className = 'chess-piece';
        this.element.alt = name;
    };
};

export default HTMLPiece
/**
 * Class representing a chess piece
 * Extended Pieces are: Rook(), Knight(), Bishop(), Queen(), King()
 */
class Piece {
    #element
    #className
    #team;
    #row;
    #col;
    #fileRef;
    #rankRef;
    #positionRef;
    #positionArr;
    constructor(team) {
        this.#className = "Piece"
        this.element = null
        this.#team = team;              //0 = White, 1 = Black
        this.#row = -1                  //Base 0 - numerical row position in grid
        this.#col = -1                  //Base 0 - numerical column position in grid
        this.#fileRef = '';             //Base 1 - alphabetical row position in grid
        this.#rankRef = -1;             //Base 1 - alphabetical column position in grid
        this.#positionRef = '';         //Notational string of piece position
        this.#positionArr = [-1, -1];   //Array position of piece
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
    get team() {
        return this.#team;
    };
    set team(value) {
        this.#team = value;
    };
    get row() {
        return this.#row;
    };
    set row(value) {
        this.#row = value;
    };
    get col() {
        return this.#col;
    };
    set col(value) {
        this.#col = value;
    };
    get fileRef() {
        return this.#fileRef;
    };
    set fileRef(value) {
        this.#fileRef = value;
    };
    get rankRef() {
        return this.#rankRef;
    };
    set rankRef(value) {
        this.#rankRef = value;
    };
    get positionRef() {
        return this.#positionRef;
    };
    set positionRef(value) {
        this.#positionRef = value;
    };
    get positionArr() {
        return this.#positionArr;
    };
    set positionArr(value) {
        this.#positionArr = value;
    };


    /**
     * Creates the HTML element for the chess piece.
     * 
     * @param {string} code 2 character string of the pieces team, and type. ie: 0p = "White pawn"
     */
    createHTMLElement(code) {
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
        this.element.src = fileMap.get(code);
        this.element.className = 'chess-piece';
        this.element.alt = code;
    };


    /**
     * Update the information about the Piece() object with information from the Square() object
     * 
     * @param {Square} squareObj The Square() object where the Piece() object is residing
     */
    update(squareObj) {
        this.#row = squareObj.row;
        this.#col = squareObj.col;
        this.#rankRef = squareObj.rankRef;
        this.#fileRef = squareObj.fileRef;
        this.#positionRef = squareObj.positionRef;
        this.#positionArr = squareObj.positionArr
    };


    /**
     * Calculate the difference between ranks and files. Returns a 2 element single digit array
     * 
     * @param {string} destination WIP
     * @param {string} moveInfo WIP
     * @returns {Array<string>} WIP
     */
    getfileRefrankRefDifference(destination, moveInfo) {
        let fileRefDiff = this.positionArr[1] - destination[1];
        let rankRefDiff = this.positionArr[0] - destination[0];
        return [rankRefDiff, fileRefDiff];
    };


    /**
     * Print debugging information about the Piece() object
     */
    printToTerminal() {
        console.log(`------Debug Piece Details------`)
        console.log(`Name: ${this.name} | Team: ${this.team} | positionRef: ${this.positionRef} | positionArr: ${this.positionArr}`)
        console.log(`row: ${this.row} | col: ${this.col} | fileRef: ${this.fileRef} | rankRef: ${this.rankRef}`)
        console.log(`-----------------------`)
    };
};


/**
 * Class representing a Pawn chess piece.
 * @extends Piece
 */
class Pawn extends Piece {
    #name;
    #pieceCodeStr;
    #code
    constructor(team) {
        super(team);
        this.#name = "Pawn";
        this.#pieceCodeStr = "p";
        this.#code = team + this.#pieceCodeStr;
        this.createHTMLElement(`${this.#code}`);
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get pieceCodeStr() {
        return this.#pieceCodeStr;
    };


    /**
     * isValidMove Pawn - WIP
     * 
     */
    isValidMove(destination, moveInfo) {
        const [rankRefDiff, fileRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);

        // If the piece rankRef/fileRef location is mentioned in the notation, return matching piece (if true)
        if (moveInfo.locationPosX) {
            return this.positionArr[0] === moveInfo.locationRow
        };
        if (moveInfo.locationPosY) {
            return this.positionArr[1] === moveInfo.locationCol
        };
        if (moveInfo.isCapture) {
            return this.fileRef === moveInfo.locationPosY
        };

        // White Pawns
        if (moveInfo.teamNumber === 0) {
            if (fileRefDiff === 0 && rankRefDiff === 1) {
                return true;
            };
            if (this.row === 6 && fileRefDiff === 0 && rankRefDiff === 2) {
                return true;
            };
            // Black Pawns
        } else if (moveInfo.teamNumber === 1) {
            if (fileRefDiff === 0 && rankRefDiff === -1) {
                return true;
            };
            if (this.row === 1 && fileRefDiff === 0 && rankRefDiff === -2) {
                return true;
            };
        };
        return false;
    };
};


/**
 * Class representing a Rook chess piece.
 * @extends Piece
 */
class Rook extends Piece {
    #name;
    #pieceCodeStr;
    #code;
    constructor(team) {
        super(team);
        this.#name = "Rook";
        this.#pieceCodeStr = "R"
        this.#code = team + this.#pieceCodeStr;
        this.createHTMLElement(`${this.#code}`);
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get pieceCodeStr() {
        return this.#pieceCodeStr;
    };


    /**
     * isValidMove Rook - WIP
     * 
     */
    isValidMove(destination, moveInfo) {
        const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);

        // If the piece rankRef/fileRef location is mentioned in the notation, return matching piece (if true)
        if (moveInfo.locationPosX) {
            return this.positionArr[0] === moveInfo.locationRow
        };
        if (moveInfo.locationPosY) {
            return this.positionArr[1] === moveInfo.locationCol
        };
        return fileRefDiff === 0 || rankRefDiff === 0;
    };
};

/**
 * Class representing a Knight chess piece.
 * @extends Piece
 */
class Knight extends Piece {
    #name;
    #pieceCodeStr;
    #code;
    constructor(team) {
        super(team);
        this.#name = "Knight";
        this.#pieceCodeStr = "N"
        this.#code = team + this.#pieceCodeStr;
        this.createHTMLElement(`${this.#code}`);
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get pieceCodeStr() {
        return this.#pieceCodeStr;
    };

    /**
     * isValidMove Knight - WIP
     * 
     */
    isValidMove(destination, moveInfo) {
        const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);

        // If the piece rankRef/fileRef location is mentioned in the notation, return matching piece (if true)
        if (moveInfo.locationPosX) {
            return this.positionArr[0] === moveInfo.locationRow
        };
        if (moveInfo.locationPosY) {
            return this.positionArr[1] === moveInfo.locationCol
        };

        if (this.col !== null && this.row === null) {
            return this.row === fileRefDiff;
        };
        return (Math.abs(fileRefDiff) === 1 && Math.abs(rankRefDiff) === 2) || (Math.abs(fileRefDiff) === 2 && Math.abs(rankRefDiff) === 1);
    };

};

/**
 * Class representing a Bishop chess piece.
 * @extends Piece
 */
class Bishop extends Piece {
    #name;
    #pieceCodeStr;
    #code;
    constructor(team) {
        super(team);
        this.#name = "Bishop";
        this.#pieceCodeStr = "B"
        this.#code = team + this.#pieceCodeStr;
        this.createHTMLElement(`${this.#code}`);
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get pieceCodeStr() {
        return this.#pieceCodeStr;
    };

    /**
     * isValidMove Bishop - WIP
     * 
     */
    isValidMove(destination, moveInfo) {
        const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);
        return Math.abs(fileRefDiff) === Math.abs(rankRefDiff);
    };

};


/**
 * Class representing a Queen chess piece.
 * @extends Piece
 */
class Queen extends Piece {
    #name;
    #pieceCodeStr;
    #code;
    constructor(team) {
        super(team);
        this.#name = "Queen";
        this.#pieceCodeStr = "Q";
        this.#code = team + this.#pieceCodeStr;
        this.createHTMLElement(`${this.#code}`);
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get pieceCodeStr() {
        return this.#pieceCodeStr;
    };

    /**
     * isValidMove Queen - WIP
     * 
     */
    isValidMove(destination, moveInfo) {
        const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);
        const diagionalMoves = Math.abs(fileRefDiff) === Math.abs(rankRefDiff);
        const straightMoves = fileRefDiff === 0 || rankRefDiff === 0;

        if (diagionalMoves || straightMoves) {
            return true
        }
    };
};


/**
 * Class representing a King chess piece.
 * @extends Piece
 */
class King extends Piece {
    #name;
    #pieceCodeStr;
    #code
    constructor(team) {
        super(team);
        this.#name = "King";
        this.#pieceCodeStr = "K";
        this.#code = team + this.#pieceCodeStr;
        this.createHTMLElement(`${this.#code}`);
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get pieceCodeStr() {
        return this.#pieceCodeStr;
    };

    /**
     * isValidMove King - WIP
     * 
     */
    isValidMove(destination, moveInfo) {
        const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);
        return Math.abs(fileRefDiff) <= 1 && Math.abs(rankRefDiff) <= 1;
    };
};





export {Piece, Pawn, Rook, Knight, Bishop, Queen, King};
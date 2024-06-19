/**
 * Class representing a chess piece
 * Extended Pieces are: Rook(), Knight(), Bishop(), Queen(), King()
 */
class Piece {
    #element;           // This DOM element
    #className;         // Name of this class
    #team;              // 0 = White, 1 = Black
    #row;               // Base 0 - numerical row position in grid
    #col;               // Base 0 - numerical column position in grid
    #fileRef;           // Base 1 - alphabetical row position in grid
    #rankRef;           // Base 1 - alphabetical column position in grid
    #positionRef;       // Notational string of piece position
    #positionArr;       // Array position of piece
    #fen;               // Letter code of piece for FEN notation
    
    constructor(team) {
        this.#className = "Piece"
        this.#element = null
        this.#team = team;
        this.#row = -1
        this.#col = -1
        this.#fileRef = '';
        this.#rankRef = -1; 
        this.#positionRef = '';
        this.#positionArr = [-1, -1];
        this.#fen
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
    get fen() {
        return this.#fen;
    };
    set fen(value) {
        this.#fen = value;
    };


    /**
     * Creates the HTML element for the chess piece.
     * 
     * @param {string} code 2 character string of the pieces team, and type. ie: 0p = "White pawn"
     */
    createHTMLElement(code) {
        const fileMap = new Map();
        fileMap.set("0p", "<i class='fas fa-chess-pawn pawn white-piece chess-piece'></i>");
        fileMap.set("1p", "<i class='fas fa-chess-pawn pawn black-piece chess-piece'></i>");
        fileMap.set("0R", "<i class='fas fa-chess-rook rook white-piece chess-piece'></i>");
        fileMap.set("1R", "<i class='fas fa-chess-rook rook black-piece chess-piece'></i>");
        fileMap.set("0N", "<i class='fas fa-chess-knight knight white-piece chess-piece'></i>");
        fileMap.set("1N", "<i class='fas fa-chess-knight knight black-piece chess-piece'></i>");
        fileMap.set("0B", "<i class='fas fa-chess-bishop bishop white-piece chess-piece'></i>");
        fileMap.set("1B", "<i class='fas fa-chess-bishop bishop black-piece chess-piece'></i>");
        fileMap.set("0Q", "<i class='fas fa-chess-queen queen white-piece chess-piece'></i>");
        fileMap.set("1Q", "<i class='fas fa-chess-queen queen black-piece chess-piece'></i>");
        fileMap.set("0K", "<i class='fas fa-chess-king king white-piece chess-piece'></i>");
        fileMap.set("1K", "<i class='fas fa-chess-king king black-piece chess-piece'></i>");

        const tempEl = document.createElement('i');
        tempEl.innerHTML = fileMap.get(code);
        this.element = tempEl.firstChild
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
    getfileRefrankRefDifference(destination) {
        let fileRefDiff = this.positionArr[1] - destination[1];
        let rankRefDiff = this.positionArr[0] - destination[0];
        return [rankRefDiff, fileRefDiff];
    };


    /**
     * Print debugging information about the Piece() object
     */
    printToTerminal() {
        console.log(`------Debug ${this.className} Details------`)
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
        this.fen = team===0? "P" : "p"
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
    isValidMove(destination, moveInfo = {}) {
        const [rankRefDiff, fileRefDiff] = this.getfileRefrankRefDifference(destination);

        // If the piece rankRef/fileRef location is mentioned in the notation, return matching piece (if true)
        // The difference in ranks also needs to be 1. Otherwise pawns on the same rank will be confused
        if (moveInfo.locationPosX) {
            return this.positionArr[0] === moveInfo.locationRow && Math.abs(rankRefDiff) === 1
        };
        if (moveInfo.locationPosY) {
            return this.positionArr[1] === moveInfo.locationCol && Math.abs(rankRefDiff) === 1
        };
        if (moveInfo.isCapture) {
            return this.fileRef === moveInfo.locationPosY && Math.abs(rankRefDiff) === 1
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

    // isValidMove(destination, board) {
    //     const [rankRefDiff, fileRefDiff] = this.getfileRefrankRefDifference(destination);
    //     if (this.team === 0) {
    //         if (rankRefDiff === 1 && fileRefDiff === 0 && !board[destination[0]][destination[1]]) return true;
    //         if (this.row === 6 && rankRefDiff === 2 && fileRefDiff === 0 && !board[destination[0]][destination[1]]) return true;
    //         if (rankRefDiff === 1 && Math.abs(fileRefDiff) === 1 && board[destination[0]][destination[1]] && board[destination[0]][destination[1]].team === 1) return true;
    //     } else {
    //         if (rankRefDiff === -1 && fileRefDiff === 0 && !board[destination[0]][destination[1]]) return true;
    //         if (this.row === 1 && rankRefDiff === -2 && fileRefDiff === 0 && !board[destination[0]][destination[1]]) return true;
    //         if (rankRefDiff === -1 && Math.abs(fileRefDiff) === 1 && board[destination[0]][destination[1]] && board[destination[0]][destination[1]].team === 0) return true;
    //     }
    //     return false;
    // }
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
        this.fen = team===0? "R" : "r"
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
    isValidMove(destination, moveInfo = {}) {
        const [rankRefDiff, fileRefDiff] = this.getfileRefrankRefDifference(destination);
        if (fileRefDiff === 0 || rankRefDiff === 0) return true;
        return false;
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
        this.fen = team===0? "N" : "n"
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
    // isValidMove(destination, moveInfo = {}) {
    //     const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination);

    //     // If the piece rankRef/fileRef location is mentioned in the notation, return matching piece (if true)
    //     if (moveInfo.locationPosX) {
    //         return this.positionArr[0] === moveInfo.locationRow
    //     };
    //     if (moveInfo.locationPosY) {
    //         return this.positionArr[1] === moveInfo.locationCol
    //     };

    //     if (this.col !== null && this.row === null) {
    //         return this.row === fileRefDiff;
    //     };
    //     return (Math.abs(fileRefDiff) === 1 && Math.abs(rankRefDiff) === 2) || (Math.abs(fileRefDiff) === 2 && Math.abs(rankRefDiff) === 1);
    // };

    isValidMove(destination, moveInfo = {}) {
        const [rankRefDiff, fileRefDiff] = this.getfileRefrankRefDifference(destination);
        return (Math.abs(fileRefDiff) === 1 && Math.abs(rankRefDiff) === 2) || (Math.abs(fileRefDiff) === 2 && Math.abs(rankRefDiff) === 1);
    }

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
        this.fen = team===0? "B" : "b"
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
     * isValidMove Bishop
     * 
     */
    isValidMove(destination, moveInfo = {}) {
        const [rankRefDiff, fileRefDiff] = this.getfileRefrankRefDifference(destination);
        return Math.abs(fileRefDiff) === Math.abs(rankRefDiff);
    }

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
        this.fen = team===0? "Q" : "q"
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
    isValidMove(destination, moveInfo = {}) {
        const [rankRefDiff, fileRefDiff] = this.getfileRefrankRefDifference(destination);
        const diagionalMoves = Math.abs(fileRefDiff) === Math.abs(rankRefDiff);
        const straightMoves = fileRefDiff === 0 || rankRefDiff === 0;
        return diagionalMoves || straightMoves;
    }
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
        this.fen = team===0? "K" : "k"
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
    isValidMove(destination, moveInfo = {}) {
        const [rankRefDiff, fileRefDiff] = this.getfileRefrankRefDifference(destination);
        return Math.abs(fileRefDiff) <= 1 && Math.abs(rankRefDiff) <= 1;
    }
};





export {Piece, Pawn, Rook, Knight, Bishop, Queen, King};
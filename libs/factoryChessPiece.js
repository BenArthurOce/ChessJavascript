import ChessUtility from './factoryChessUtility.js';

class Piece {
    #team;
    #row;
    #col;
    #fileRef;
    #rankRef;
    #positionRef;
    #positionArr
    #isCaptured;
    constructor(team) {
        if ((team != 0) && (team != 1)) {
            throw new Error(`team: ${team} | team number must be team 0 or 1`)
        };
        this.#team = team; //0 = White, 1 = Black
        this.#row = -1 //Base 0 - numerical row position in grid
        this.#col = -1 //Base 0 - numerical column position in grid
        this.#fileRef = ''; //Base 1 - alphabetical row position in grid
        this.#rankRef = -1; //Base 1 - alphabetical column position in grid
        this.#positionRef = ''; //Notational string of piece position
        this.#positionArr = [-1, -1] //Array position of piece
        this.#isCaptured = false; //Currently not in use
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
    get isCaptured() {
        return this.#isCaptured;
    };
    set isCaptured(value) {
        this.#isCaptured = value;
    };

    // When a chess piece is updated, it gets information about itself from the square object
    update(squareObj) {
        this.#row = squareObj.row;
        this.#col = squareObj.col;
        this.#rankRef = squareObj.rankRef;
        this.#fileRef = squareObj.fileRef;
        this.#positionRef = squareObj.positionRef;
        this.#positionArr = squareObj.positionArr
    };

    getfileRefrankRefDifference(destination, moveInfo) {
        let fileRefDiff = this.positionArr[1] - destination[1];
        let rankRefDiff = this.positionArr[0] - destination[0];
        return [rankRefDiff, fileRefDiff];
    };

    printToTerminal() {
        console.log(`------Debug Piece Details------`)
        console.log(`Name: ${this.name} | Team: ${this.team} | positionRef: ${this.positionRef} | positionArr: ${this.positionArr}`)
        console.log(`row: ${this.row} | col: ${this.col} | fileRef: ${this.fileRef} | rankRef: ${this.rankRef}`)
        console.log(`-----------------------`)
    };
};


class Pawn extends Piece {
    #name;
    #pieceCodeStr;
    #code
    constructor(team) {
        super(team);
        this.#name = "Pawn";
        this.#pieceCodeStr = "p";
        this.#code = team + this.#pieceCodeStr;
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


class Rook extends Piece {
    #name;
    #pieceCodeStr;
    #code;
    constructor(team) {
        super(team);
        this.#name = "Rook";
        this.#pieceCodeStr = "R"
        this.#code = team + this.#pieceCodeStr;
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


class Knight extends Piece {
    #name;
    #pieceCodeStr;
    #code;
    constructor(team) {
        super(team);
        this.#name = "Knight";
        this.#pieceCodeStr = "N"
        this.#code = team + this.#pieceCodeStr;
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


class Bishop extends Piece {
    #name;
    #pieceCodeStr;
    #code;
    constructor(team) {
        super(team);
        this.#name = "Bishop";
        this.#pieceCodeStr = "B"
        this.#code = team + this.#pieceCodeStr;
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

    isValidMove(destination, moveInfo) {
        const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);
        return Math.abs(fileRefDiff) === Math.abs(rankRefDiff);
    };

};


class Queen extends Piece {
    #name;
    #pieceCodeStr;
    #code;
    constructor(team) {
        super(team);
        this.#name = "Queen";
        this.#pieceCodeStr = "Q"
        this.#code = team + this.#pieceCodeStr;
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

    isValidMove(destination, moveInfo) {
        const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);
        const diagionalMoves = Math.abs(fileRefDiff) === Math.abs(rankRefDiff);
        const straightMoves = fileRefDiff === 0 || rankRefDiff === 0;

        if (diagionalMoves || straightMoves) {
            return true
        }
    };
};


class King extends Piece {
    #name;
    #pieceCodeStr;
    #code
    constructor(team) {
        super(team);
        this.#name = "King";
        this.#pieceCodeStr = "K"
        this.#code = team + this.#pieceCodeStr;
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

    isValidMove(destination, moveInfo) {
        const [fileRefDiff, rankRefDiff] = this.getfileRefrankRefDifference(destination, moveInfo);
        return Math.abs(fileRefDiff) <= 1 && Math.abs(rankRefDiff) <= 1;
    };
};

export {Piece, Pawn, Rook, Knight, Bishop, Queen, King};
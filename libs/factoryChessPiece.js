import ChessUtility from './factoryChessUtility.js';

class Piece {
    #team;
    #row;
    #col;
    #file;
    #rank;
    #notPos;
    #arrPos
    #isCaptured;
    constructor(team) {
        if ((team != 0) && (team != 1)) {
            throw new Error(`team: ${team} | team number must be team 0 or 1`)
        };
        this.#team = team; //0 = White, 1 = Black
        this.#row = -1 //Base 0 - numerical row position in grid
        this.#col = -1 //Base 0 - numerical column position in grid
        this.#file = ''; //Base 1 - alphabetical row position in grid
        this.#rank = -1; //Base 1 - alphabetical column position in grid
        this.#notPos = ''; //Notational string of piece position
        this.#arrPos = [-1, -1] //Array position of piece
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
    get file() {
        return this.#file;
    };
    set file(value) {
        this.#file = value;
    };
    get rank() {
        return this.#rank;
    };
    set rank(value) {
        this.#rank = value;
    };
    get notPos() {
        return this.#notPos;
    };
    set notPos(value) {
        this.#notPos = value;
    };
    get arrPos() {
        return this.#arrPos;
    };
    set arrPos(value) {
        this.#arrPos = value;
    };
    get isCaptured() {
        return this.#isCaptured;
    };
    set isCaptured(value) {
        this.#isCaptured = value;
    };

    setPosition(x, y) {
        if ((x < 0 || x > 7) || (y < 0 || y > 7)) {
            throw new Error(`row: ${x}  col: ${y} is not a valid position`)
        };
        this.#row = x;
        this.#col = y;
        this.#rank = ChessUtility.rowArrayToRef(x)
        this.#file = (y + 10).toString(36);
        this.#notPos = this.file + this.rank;
        this.#arrPos = [x, y];
    };

    clearData() {
        this.team = null;
        this.row = -1
        this.col = -1
        this.file = '';
        this.rank = -1;
        this.notPos = '';
        this.arrPos = [-1, -1]
        this.isCaptured = false;
    };

    getFileRankDifference(destination, moveInfo) {
        let fileDiff = this.arrPos[1] - destination[1];
        let rankDiff = this.arrPos[0] - destination[0];
        return [rankDiff, fileDiff];
    };

    printToTerminal() {
        console.log(`------Debug Piece Details------`)
        console.log(`Name: ${this.name} | Team: ${this.team} | notPos: ${this.notPos} | arrPos: ${this.arrPos}`)
        console.log(`row: ${this.row} | col: ${this.col} | file: ${this.file} | rank: ${this.rank}`)
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
        const [rankDiff, fileDiff] = this.getFileRankDifference(destination, moveInfo);

        // If the piece rank/file location is mentioned in the notation, return matching piece (if true)
        if (moveInfo.locationPosX) {
            return this.arrPos[0] === moveInfo.locationRow
        };
        if (moveInfo.locationPosY) {
            return this.arrPos[1] === moveInfo.locationCol
        };
        if (moveInfo.isCapture) {
            return this.file === moveInfo.locationPosY
        };

        // White Pawns
        if (moveInfo.teamNumber === 0) {
            if (fileDiff === 0 && rankDiff === 1) {
                return true;
            };
            if (this.row === 6 && fileDiff === 0 && rankDiff === 2) {
                return true;
            };
            // Black Pawns
        } else if (moveInfo.teamNumber === 1) {
            if (fileDiff === 0 && rankDiff === -1) {
                return true;
            };
            if (this.row === 1 && fileDiff === 0 && rankDiff === -2) {
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
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);

        // If the piece rank/file location is mentioned in the notation, return matching piece (if true)
        if (moveInfo.locationPosX) {
            return this.arrPos[0] === moveInfo.locationRow
        };
        if (moveInfo.locationPosY) {
            return this.arrPos[1] === moveInfo.locationCol
        };
        return fileDiff === 0 || rankDiff === 0;
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
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);

        // If the piece rank/file location is mentioned in the notation, return matching piece (if true)
        if (moveInfo.locationPosX) {
            return this.arrPos[0] === moveInfo.locationRow
        };
        if (moveInfo.locationPosY) {
            return this.arrPos[1] === moveInfo.locationCol
        };

        if (this.col !== null && this.row === null) {
            return this.row === fileDiff;
        };
        return (Math.abs(fileDiff) === 1 && Math.abs(rankDiff) === 2) || (Math.abs(fileDiff) === 2 && Math.abs(rankDiff) === 1);
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
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);
        return Math.abs(fileDiff) === Math.abs(rankDiff);
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
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);
        const diagionalMoves = Math.abs(fileDiff) === Math.abs(rankDiff);
        const straightMoves = fileDiff === 0 || rankDiff === 0;

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
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);
        return Math.abs(fileDiff) <= 1 && Math.abs(rankDiff) <= 1;
    };
};

export {Piece, Pawn, Rook, Knight, Bishop, Queen, King};
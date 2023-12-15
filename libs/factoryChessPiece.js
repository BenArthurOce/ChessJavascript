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
        if ((team != 0) && (team != 1)) {throw new Error(`team: ${team} | team number must be team 0 or 1`)};
        this.#team = team;          //0 = White, 1 = Black
        this.#row = -1              //Base 0 - numerical row position in grid
        this.#col = -1              //Base 0 - numerical column position in grid
        this.#file = '';            //Base 1 - alphabetical row position in grid
        this.#rank = -1;            //Base 1 - alphabetical column position in grid
        this.#notPos = '';          //Notational string of piece position
        this.#arrPos = [-1, -1]     //Array position of piece
        this.#isCaptured = false;   //Currently not in use
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

    updatePosition(x, y) {
        if ((x < 0 || x > 7) || (y < 0 || y > 7)) {
            throw new Error(`row: ${x}  col: ${y} is not a valid position`)}

        this.row = x;
        this.col = y;
        this.rank = ChessUtility.rowArrayToRef(x)
        this.file = (y + 10).toString(36);
        this.notPos = this.file + this.rank;
        this.arrPos = [x, y];
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
        let fileDiff = this.arrPos[0] - destination[0];
        let rankDiff = this.arrPos[1] - destination[1];

        console.log(destination, moveInfo)



        return [rankDiff, fileDiff];
    };

    getFileRankDifference2(destination, moveInfo) {
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
    #code;
    #name;
    #code2NEW;
    constructor(team) {
        super(team);
        this.#code = team +  "p";
        this.#name = "Pawn";
        this.#code2NEW = "p";
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2NEW() {
        return this.#code2NEW;
    };

    isPawnMoveValid(destination, moveInfo) {
        const [rankDiff, fileDiff] = this.getFileRankDifference2(destination, moveInfo);
        if (moveInfo.get("is-capture")) {
            return this.file === moveInfo.get("file");
        }

        console.log(this.arrPos, " is the array position")

        if (moveInfo.get("team-num") === 0) {
            console.log([rankDiff, fileDiff])
            if (fileDiff === 0 && rankDiff === 1) {
                return true;
            };
            if (this.row === 6 && fileDiff === 0 && rankDiff === 2) {
                return true;
            };

        } else if (moveInfo.get("team-num") === 1) {
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
    #code;
    #name;
    #code2NEW;
    constructor(team) {
        super(team);
        this.#code = team +  "R";
        this.#name = "Rook";
        this.#code2NEW = "R"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2NEW() {
        return this.#code2NEW;
    };

    isValidMove(destination, moveInfo) {
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);
        return fileDiff === 0 || rankDiff === 0;
    };
};


class Knight extends Piece {
    #code;
    #name;
    #code2NEW;
    constructor(team) {
        super(team);
        this.#code = team +  "N";
        this.#name = "Knight";
        this.#code2NEW = "N"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2NEW() {
        return this.#code2NEW;
    };

    isValidMove(destination, moveInfo) {
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);

        if (moveInfo.get("loc-posX")) {
            if(this.arrPos[0] === moveInfo.get("loc-posX")) {
                return true
            } else {
                return false
            }   
        }
        
        if (moveInfo.get("loc-posY")) {
            if(this.arrPos[1] === moveInfo.get("loc-posY")) {
                return true
            } else {
                return false
            }
        }

        if (this.col !== null && this.row === null) {
            return this.row === fileDiff;
        };
        return (Math.abs(fileDiff) === 1 && Math.abs(rankDiff) === 2) || (Math.abs(fileDiff) === 2 && Math.abs(rankDiff) === 1);
    };

};


class Bishop extends Piece {
    #code;
    #name;
    #code2NEW;
    constructor(team) {
        super(team);
        this.#code = team +  "B";
        this.#name = "Bishop";
        this.#code2NEW = "B"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2NEW() {
        return this.#code2NEW;
    };

    isValidMove(destination, moveInfo) {
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);
        return Math.abs(fileDiff) === Math.abs(rankDiff);
    };

};


class Queen extends Piece {
    #code;
    #name;
    #code2NEW;
    constructor(team) {
        super(team);
        this.#code = team +  "Q";
        this.#name = "Queen";
        this.#code2NEW = "Q"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2NEW() {
        return this.#code2NEW;
    };

    isValidMove(destination, moveInfo) {

        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);
        const diagionalMoves =  Math.abs(fileDiff) === Math.abs(rankDiff);
        const straightMoves =  fileDiff === 0 || rankDiff === 0;

        if (diagionalMoves || straightMoves) {return true}
    };
    
 };


class King extends Piece {
    #code;
    #name;
    #code2NEW;
    constructor(team) {
        super(team);
        this.#code = team +  "K";
        this.#name = "King";
        this.#code2NEW = "K"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2NEW() {
        return this.#code2NEW;
    };

    isValidMove(destination, moveInfo) {
        const [fileDiff, rankDiff] = this.getFileRankDifference(destination, moveInfo);
        return Math.abs(fileDiff) <= 1 && Math.abs(rankDiff) <= 1;
    };
};

export {Piece, Pawn, Rook, Knight, Bishop, Queen, King};
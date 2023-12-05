
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

        const boardToRow = {0:8, 1:7, 2:6, 3:5, 4:4, 5:3, 6:2, 7:1, 8:0};
        const rowToBoard = {8:0, 7:1, 6:2, 5:3, 4:4, 3:5, 2:6, 1:7, 0:8};
        
        const boardtoCol = {'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7};
        const coltoBoard = {0:'a', 1:'b', 2:'c', 3:'d', 4:'e', 5:'f', 6:'g', 7:'h'}



        this.row = x;
        this.col = y;
        this.rank = rowToBoard[x];
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
    }


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
    #code2;
    constructor(team) {
        super(team);
        this.#code = team +  "p";
        this.#name = "Pawn";
        this.#code2 = "p"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2() {
        return this.#code2;
    };

    findLegalMoves() {
        const legalMoves = [];
        const isStartPosition = this.isInitialPosition(this.arrPos)

        const x = this.arrPos[0]
        const y = this.arrPos[1]

        // White pawns are at the 6th row of the 2d array, meaning their number must be reduced
        const direction = this.team === 0 ? -1 : 1;

        // Standard move
        const standardMove = [x + direction, y];
        if (this.isValidMove(standardMove)) {
            legalMoves.push(standardMove);

            // Two-square initial move
            const initialMove = [x + 2 * direction, y];
            if (isStartPosition && this.isValidMove(initialMove)) {
                legalMoves.push(initialMove);
            }
        }

        // Capture moves
        const captureMoves = [
            [x + direction, y + 1],
            [x + direction, y - 1]
        ];

        for (const captureMove of captureMoves) {
            if (this.isValidMove(captureMove)) {
                legalMoves.push(captureMove);
            }
        }

        return legalMoves;
    };

    isValidMove([x, y]) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    };

    isInitialPosition([x, y]) {
        // Check if the pawn is in its starting position
        return (this.team === 0 && x === 6) || (this.team === 1 && x === 1);
    };
};


class Rook extends Piece {
    #code;
    #name;
    #code2;
    constructor(team) {
        super(team);
        this.#code = team +  "R";
        this.#name = "Rook";
        this.#code2 = "R"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2() {
        return this.#code2;
    };

    findLegalMoves() {
        const legalMoves = [];

        // Horizontal moves
        for (let i = 0; i < 8; i++) {
            if (i !== this.arrPos[0]) {
                legalMoves.push([i, this.arrPos[1]]);
            }
        };

        // Vertical moves
        for (let j = 0; j < 8; j++) {
            if (j !== this.arrPos[1]) {
                legalMoves.push([this.arrPos[0], j]);
            }
        };

        return legalMoves;
    };
};

class Knight extends Piece {
    #code;
    #name;
    #code2;
    constructor(team) {
        super(team);
        this.#code = team +  "N";
        this.#name = "Knight";
        this.#code2 = "N"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2() {
        return this.#code2;
    };

    findLegalMoves() {
        const legalMoves = [];
        const moves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];

        for (const [dx, dy] of moves) {
            const x = this.arrPos[0] + dx;
            const y = this.arrPos[1] + dy;

            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                legalMoves.push([x, y]);
            };
        };
        return legalMoves;
    };
};

class Bishop extends Piece {
    #code;
    #name;
    #code2;
    constructor(team) {
        super(team);
        this.#code = team +  "B";
        this.#name = "Bishop";
        this.#code2 = "B"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2() {
        return this.#code2;
    };
    findLegalMoves() {
        const legalMoves = [];

        // Diagonal moves
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (Math.abs(i - this.arrPos[0]) === Math.abs(j - this.arrPos[1]) &&
                    (i !== this.arrPos[0] || j !== this.arrPos[1])) {
                    legalMoves.push([i, j]);
                };
            };
        };

        return legalMoves;
    };
};

class Queen extends Piece {
    #code;
    #name;
    #code2;
    constructor(team) {
        super(team);
        this.#code = team +  "Q";
        this.#name = "Queen";
        this.#code2 = "Q"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2() {
        return this.#code2;
    };
    findLegalMoves() {
        const legalMoves = [];

        // Horizontal and vertical moves
        for (let i = 0; i < 8; i++) {
            if (i !== this.arrPos[0]) {
                legalMoves.push([i, this.arrPos[1]]);
            };
            if (i !== this.arrPos[1]) {
                legalMoves.push([this.arrPos[0], i]);
            };
        };

        // Diagonal moves
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (Math.abs(i - this.arrPos[0]) === Math.abs(j - this.arrPos[1]) &&
                    (i !== this.arrPos[0] || j !== this.arrPos[1])) {
                    legalMoves.push([i, j]);
                };
            };
        };

        return legalMoves;
    };
};

class King extends Piece {
    #code;
    #name;
    #code2;
    constructor(team) {
        super(team);
        this.#code = team +  "K";
        this.#name = "King";
        this.#code2 = "K"
    };
    get code() {
        return this.#code;
    };
    get name() {
        return this.#name;
    };
    get code2() {
        return this.#code2;
    };

    findLegalMoves() {
        const legalMoves = [];
        const moves = [
            [1, 0], [1, 1], [0, 1], [-1, 0],
            [-1, -1], [0, -1], [-1, 1], [1, -1]
        ];

        for (const [dx, dy] of moves) {
            const x = this.arrPos[0] + dx;
            const y = this.arrPos[1] + dy;

            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                legalMoves.push([x, y]);
            };
        };

        return legalMoves;
    };
};

export {Piece, Pawn, Rook, Knight, Bishop, Queen, King};
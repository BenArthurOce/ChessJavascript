import { MoveValidationStrategy, PawnMoveStrategy, RookMoveStrategy, KnightMoveStrategy, BishopMoveStrategy, QueenMoveStrategy, KingMoveStrategy } from "./MoveValidationStrategy.js";



// Class representing a chess piece
class Piece {
    constructor(team, strategy) {
        this.team = team;
        this.strategy = strategy; // Hold reference to the current strategy
    }

    // Method to validate move using current strategy
    isValidMove(destination, moveInfo) {
        return this.strategy.isValidMove(this, destination, moveInfo);
    }

    // Method to create HTML element for the piece (example method)
    createHTMLElement() {
        // Example: Create HTML element based on piece type and team
        const code = `${this.team}${this.constructor.name.charAt(0)}`; // Example piece code (e.g., "0P" for white pawn)
        const fileMap = new Map([
            ["0P", "<i class='fas fa-chess-pawn pawn white-piece chess-piece'></i>"],
            ["1P", "<i class='fas fa-chess-pawn pawn black-piece chess-piece'></i>"],
            ["0R", "<i class='fas fa-chess-rook rook white-piece chess-piece'></i>"],
            ["1R", "<i class='fas fa-chess-rook rook black-piece chess-piece'></i>"],
            ["0N", "<i class='fas fa-chess-knight knight white-piece chess-piece'></i>"],
            ["1N", "<i class='fas fa-chess-knight knight black-piece chess-piece'></i>"],
            ["0B", "<i class='fas fa-chess-bishop bishop white-piece chess-piece'></i>"],
            ["1B", "<i class='fas fa-chess-bishop bishop black-piece chess-piece'></i>"],
            ["0Q", "<i class='fas fa-chess-queen queen white-piece chess-piece'></i>"],
            ["1Q", "<i class='fas fa-chess-queen queen black-piece chess-piece'></i>"],
            ["0K", "<i class='fas fa-chess-king king white-piece chess-piece'></i>"],
            ["1K", "<i class='fas fa-chess-king king black-piece chess-piece'></i>"]
        ]);

        const tempEl = document.createElement('i');
        tempEl.innerHTML = fileMap.get(code);
        this.element = tempEl.firstChild;
    }

    // Method to update piece information (example method)
    update(squareObj) {
        this.row = squareObj.row;
        this.col = squareObj.col;
        this.rankRef = squareObj.rankRef;
        this.fileRef = squareObj.fileRef;
        this.positionRef = squareObj.positionRef;
        this.positionArr = squareObj.positionArr;
    }

    // Example additional properties and methods as per your existing implementation
    getfileRefrankRefDifference(destination) {
        let fileRefDiff = this.positionArr[1] - destination[1];
        let rankRefDiff = this.positionArr[0] - destination[0];
        return [rankRefDiff, fileRefDiff];
    }

    printToTerminal() {
        console.log(`------Debug ${this.constructor.name} Details------`);
        console.log(`Name: ${this.constructor.name} | Team: ${this.team} | positionRef: ${this.positionRef} | positionArr: ${this.positionArr}`);
        console.log(`row: ${this.row} | col: ${this.col} | fileRef: ${this.fileRef} | rankRef: ${this.rankRef}`);
        console.log(`-----------------------`);
    }
}

// Class representing a Pawn chess piece
class Pawn extends Piece {
    constructor(team) {
        super(team, new PawnMoveStrategy());
        this.name = "Pawn";
        this.pieceCodeStr = "P";
        this.code = `${team}${this.pieceCodeStr}`;
        this.fen = team === 0 ? "P" : "p";
        this.createHTMLElement();
    }
}

// Class representing a Rook chess piece
class Rook extends Piece {
    constructor(team) {
        super(team, new RookMoveStrategy());
        this.name = "Rook";
        this.pieceCodeStr = "R";
        this.code = `${team}${this.pieceCodeStr}`;
        this.fen = team === 0 ? "R" : "r";
        this.createHTMLElement();
    }
}

// Class representing a Knight chess piece
class Knight extends Piece {
    constructor(team) {
        super(team, new KnightMoveStrategy());
        this.name = "Knight";
        this.pieceCodeStr = "N";
        this.code = `${team}${this.pieceCodeStr}`;
        this.fen = team === 0 ? "N" : "n";
        this.createHTMLElement();
    }
}

// Class representing a Bishop chess piece
class Bishop extends Piece {
    constructor(team) {
        super(team, new BishopMoveStrategy());
        this.name = "Bishop";
        this.pieceCodeStr = "B";
        this.code = `${team}${this.pieceCodeStr}`;
        this.fen = team === 0 ? "B" : "b";
        this.createHTMLElement();
    }
}

// Class representing a Queen chess piece
class Queen extends Piece {
    constructor(team) {
        super(team, new QueenMoveStrategy());
        this.name = "Queen";
        this.pieceCodeStr = "Q";
        this.code = `${team}${this.pieceCodeStr}`;
        this.fen = team === 0 ? "Q" : "q";
        this.createHTMLElement();
    }
}

// Class representing a King chess piece
class King extends Piece {
    constructor(team) {
        super(team, new KingMoveStrategy());
        this.name = "King";
        this.pieceCodeStr = "K";
        this.code = `${team}${this.pieceCodeStr}`;
        this.fen = team === 0 ? "K" : "k";
        this.createHTMLElement();
    }
}

export {Piece, Pawn, Rook, Knight, Bishop, Queen, King};
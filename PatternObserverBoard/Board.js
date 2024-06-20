// import StaticChessUtility from './StaticChessUtility.js';
// import StaticErrorCheck from './StaticErrorCheck.js';
// import Square from './Square.js';
// import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from "./Piece.js";
// import Subject from './Subject.js';


import StaticChessUtility from '../libs/StaticChessUtility.js';
import StaticErrorCheck from '../libs/StaticErrorCheck.js';
import Square from '../libs/Square.js';
import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from '../libs/Piece.js';
import BoardSubject from './BoardSubject.js';

class BoardUsingFEN extends BoardSubject {
    #parentElement;
    #element;
    #className;
    #idNumber;
    #grid;
    #fen;

    constructor(idNumber, parentElement, fen) {
        super(); // Call the Subject constructor
        // this.commandManager = new CommandManager();
        this.#parentElement = parentElement;
        this.#element = document.createElement('div');
        this.#className = "Board";
        this.#idNumber = idNumber;
        this.#grid = [];
        this.#fen = fen;
    }

    get parentElement() {
        return this.#parentElement;
    }
    get element() {
        return this.#element;
    }
    set element(value) {
        this.#element = value;
    }
    get className() {
        return this.#className;
    }
    get idNumber() {
        return this.#idNumber;
    }
    get grid() {
        return this.#grid;
    }
    set grid(value) {
        this.#grid = value;
    }
    get fen() {
        return this.#fen;
    }

    returnBoardAsString() {
        const myArray = this.getArray("code", "-").flat();
        let joinedString = '[' + myArray.join(" || ") + ']';
        return [joinedString];
    }

    initSquares() {
        this.grid = Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => new Square(row, col, this.element))
        );
        this.notifyObservers(); // Notify observers after initializing squares
    }

    parseFEN(fen) {
        const isCapitalized = (char) => /[A-Z]/.test(char);
        const fenParts = fen.split(" ");
        const boardLayout = fenParts[0];
        const rows = boardLayout.split("/");
        const result = [];

        rows.forEach((row) => {
            const newRow = [];
            const splitRow = row.split("");

            splitRow.forEach((char) => {
                if (!isNaN(char)) {
                    for (let j = 0; j < parseInt(char, 10); j++) {
                        newRow.push(null);
                    }
                } else {
                    newRow.push(char);
                }
            });
            result.push(newRow);
        });
        return result;
    }

    initPieces(fen) {
        if (!fen) {
            console.error("FEN string is empty");
            return;
        }

        const fenParts = fen.split(" ");
        if (fenParts.length < 1) {
            console.error("Invalid FEN string");
            return;
        }

        const boardLayout = fenParts[0];
        const rows = boardLayout.split("/");
        if (rows.length !== 8) {
            console.error("Invalid FEN board layout");
            return;
        }

        const pieceMap = {
            'P': (color) => new Pawn(color),
            'N': (color) => new Knight(color),
            'B': (color) => new Bishop(color),
            'R': (color) => new Rook(color),
            'Q': (color) => new Queen(color),
            'K': (color) => new King(color)
        };

        const fenBoard = this.parseFEN(fen);

        const fileLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        fenBoard.forEach((row, rowIndex) => {
            row.forEach((char, colIndex) => {
                if (char !== null) {
                    const color = char === char.toUpperCase() ? 0 : 1;
                    const pieceType = char.toUpperCase();
                    const piece = pieceMap[pieceType](color);
                    const position = fileLabels[colIndex] + (8 - rowIndex);
                    this.putPieceFromRef(piece, position);
                }
            });
        });
        this.notifyObservers(); // Notify observers after initializing pieces
    }

    returnSquare(ref) {
        StaticErrorCheck.validateCellRef(ref);
        return this.grid.flat().find(square => square.positionRef === ref);
    }

    putPieceFromRef(piece, refTarget) {
        StaticErrorCheck.validateCellRef(refTarget);
        this.returnSquare(refTarget).setPiece(piece)
        this.notifyObservers(); // Notify observers after placing a piece
    }

    movePiece(pieceToMove, refTarget) {
        StaticErrorCheck.validateIsChessPiece(pieceToMove)
        StaticErrorCheck.validateCellRef(refTarget)

        this.returnSquare(pieceToMove.positionRef).clearContents()
        this.returnSquare(refTarget).clearContents()

        this.returnSquare(refTarget).setPiece(pieceToMove)
        this.notifyObservers(); // Notify observers after moving a piece
    }

    performCastling(teamNum, castlingSide) {
        StaticErrorCheck.validateTeamNumber(teamNum);
        StaticErrorCheck.validateCastlingCommand(castlingSide);

        const key = `${teamNum}_${castlingSide}`;
        const castlingInstructions = {
             "0_Kingside":  {kingFrom: "e1", kingTo: "g1", rookFrom: "h1", rookTo: "f1"},
             "1_Kingside":  {kingFrom: "e8", kingTo: "g8", rookFrom: "h8", rookTo: "f8"},
             "0_Queenside": {kingFrom: "e1", kingTo: "c1", rookFrom: "a1", rookTo: "d1"},
             "1_Queenside": {kingFrom: "e8", kingTo: "c8", rookFrom: "a8", rookTo: "d8"}
        };
        const moves = castlingInstructions[key]

        StaticErrorCheck.validateContents(this.returnSquare(moves.kingFrom), King);
        StaticErrorCheck.validateContents(this.returnSquare(moves.rookFrom), Rook);

        const king = this.returnSquare(moves.kingFrom).piece;
        const rook = this.returnSquare(moves.rookFrom).piece;
        this.movePiece(king, moves.kingTo);
        this.movePiece(rook, moves.rookTo);
        this.notifyObservers(); // Notify observers after castling
    }

    filterBoardByAttribute(code, attributeName, attributeValue) {
        const array = this.grid.map(row =>
            row.map(square => (square.piece instanceof Piece ? square.piece : null))
        ).flat();
        return array
            .filter(piece => piece && piece.pieceCodeStr === code)
            .filter(piece => piece[attributeName] === attributeValue);
    }

    getArray(attribute, ifNull) {
        return this.grid.map(row =>
            row.map(square => (square.piece instanceof Piece ? square.piece[attribute] : ifNull))
        );
    }

    constructFEN() {
        console.log("--constructFEN--");
        const myBoard = this.getArray("fen", "-");
        console.log(myBoard); // this is the array

        function rowToFEN(row) {
            let fenRow = '';
            let emptyCount = 0;
            for (let square of row) {
                if (square === '-') {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        fenRow += emptyCount;
                        emptyCount = 0;
                    }
                    fenRow += square;
                }
            }
            if (emptyCount > 0) {
                fenRow += emptyCount;
            }
            return fenRow;
        }

        const fenRows = myBoard.map(rowToFEN); // Use myBoard instead of chessboard
        return fenRows.join('/');
    }

    printToTerminal() {
        const positionArray = this.getArray("code", "--")

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const nums = [7, 6, 5, 4, 3, 2, 1, 0];

        let board = '\n';
        board += '  │  0 │  1 │  2 │  3 │  4 │  5 │  6 │  7 │\n'
        board += '──┼────┼────┼────┼────┼────┼────┼────┼────┤\n'
        for (let row = 0; row < 8; row++) {
            board += `${files[row]} │`
            for (let col = 0; col < 8; col++) {
                board += ` ${positionArray[row][col] || ''} │`
            }
            board += '\n'
        }

        console.log(board)
    }
}

export default BoardUsingFEN;

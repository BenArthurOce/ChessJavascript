import StaticChessUtility from './StaticChessUtility.js';
import StaticErrorCheck from './StaticErrorCheck.js';
import Square from './Square.js';
import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from "./Piece.js";

// import CommandManager from './commands/CommandManager.js';

import CommandManager from '../command/CommandManager.js';


/* 
The Board() class generally lives inside the "Game" class on a 1 for 1 basis
Board() contains 64 Square() objects inside its grid attribute
The functions inside Board() are generally related to placing and moving Piece() on different Square() objects, and also 
to easily find and return single or multiple Square() objects, dependant on criteria
Game() contains the Board() object, which contains all the Square() and Piece Object()
*/

class BoardUsingFEN {
    #parentElement;     // Object that contains this object, it will always be Game()
    #element;           // This DOM element
    #className;         // Name of this class
    #idNumber;          // Id number of the game. This is obtained from the Game() object
    #grid;              // 2d array of the chessboard. Contains 64 Square() objects 
    #fen;               // The FEN string of the board

    constructor(idNumber, parentElement, fen) {
        console.log(`\t\tFunc: START constructor (Board)`);
        console.log(fen)
        this.commandManager = new CommandManager();
        this.#parentElement = parentElement;
        this.#element = document.createElement('div');
        this.#className = "Board";
        this.#idNumber = idNumber;
        this.#grid = [];
        this.#fen = fen;
        // console.log(`\t\tFunc: END constructor (Board)`);
    };


    executeCommand(command) {
        this.commandManager.execute(command);
    }

    undoLastCommand() {
        this.commandManager.undo();
    }

    redoLastUndoneCommand() {
        this.commandManager.redo();
    }


    get parentElement() {
        return this.#parentElement;
    };
    get element() {
        return this.#element;
    };
    set element(value) {
        this.#element = value;
    };
    get className() {return this.#className;
    };
    get idNumber() {
        return this.#idNumber;
    };
    get grid() {
        return this.#grid;
    };
    set grid(value) {
        this.#grid = value;
    };
    get fen() {
        return this.#fen;
    };

    returnBoardAsString() {
        const myArray = this.getArray("code", "-").flat();
        let joinedString = '[' + myArray.join(" || ") + ']';
        return [joinedString];
    };
    
    /**
     * Creates the 64 Square Objects, and adds them to the grid attribute of Board(). Also appends the HTML elements
     */
    initSquares() {
        // console.log(`\t\t\t\tFunc: START initSquares (Square)`);
        // Populate the grid attribute with Square() objects. The Square() object will create and append the element
        this.grid = Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => new Square(row, col, this.element))
        );
        // console.log(`\t\t\t\tFunc: END initSquares (Square)`);
    };


    parseFEN = (fen) => {
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
    };
    
    /**
     * Initializes the pieces on the board based on a FEN string.
     */
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
    }
    
    


    // /**
    //  * Initializes the pieces on the board.
    //  */
    // initPieces() {
    //     // Create Chess Pieces and place on board - White
    //     this.putPieceFromRef(new Rook(0), "a1");
    //     this.putPieceFromRef(new Knight(0), "b1");
    //     this.putPieceFromRef(new Bishop(0), "c1");
    //     this.putPieceFromRef(new Queen(0), "d1");
    //     this.putPieceFromRef(new King(0), "e1");
    //     this.putPieceFromRef(new Bishop(0), "f1");
    //     this.putPieceFromRef(new Knight(0), "g1");
    //     this.putPieceFromRef(new Rook(0), "h1");

    //     this.putPieceFromRef(new Pawn(0), "a2");
    //     this.putPieceFromRef(new Pawn(0), "b2");
    //     this.putPieceFromRef(new Pawn(0), "c2");
    //     this.putPieceFromRef(new Pawn(0), "d2");
    //     this.putPieceFromRef(new Pawn(0), "e2");
    //     this.putPieceFromRef(new Pawn(0), "f2");
    //     this.putPieceFromRef(new Pawn(0), "g2");
    //     this.putPieceFromRef(new Pawn(0), "h2");

    //     // Create Chess Pieces and place on board - Black
    //     this.putPieceFromRef(new Rook(1), "a8");
    //     this.putPieceFromRef(new Knight(1), "b8");
    //     this.putPieceFromRef(new Bishop(1), "c8");
    //     this.putPieceFromRef(new Queen(1), "d8");
    //     this.putPieceFromRef(new King(1), "e8");
    //     this.putPieceFromRef(new Bishop(1), "f8");
    //     this.putPieceFromRef(new Knight(1), "g8");
    //     this.putPieceFromRef(new Rook(1), "h8");

    //     this.putPieceFromRef(new Pawn(1), "a7");
    //     this.putPieceFromRef(new Pawn(1), "b7");
    //     this.putPieceFromRef(new Pawn(1), "c7");
    //     this.putPieceFromRef(new Pawn(1), "d7");
    //     this.putPieceFromRef(new Pawn(1), "e7");
    //     this.putPieceFromRef(new Pawn(1), "f7");
    //     this.putPieceFromRef(new Pawn(1), "g7");
    //     this.putPieceFromRef(new Pawn(1), "h7");
    // };


    /**
     * Returns a square on the chessboard by looking up its 2 character string reference
     * 
     * @param {string} ref The position reference of the square ie: "a5".
     * @returns {Square} The Square() object.
     */
    returnSquare(ref) {
        StaticErrorCheck.validateCellRef(ref);
        return this.grid.flat().find(square => square.positionRef === ref);
    };


    /**
     * Places piece on chessboard. Used for the opening function. Could be removed?
     * 
     * @param {Piece} piece Piece() object that is to be moved
     * @param {string} refTarget 2 character string of the destination square reference that the peice is to be added to
     */
    putPieceFromRef(piece, refTarget) {
        StaticErrorCheck.validateCellRef(refTarget);
        this.returnSquare(refTarget).setPiece(piece)
    };


    /**
     * Gets the two squares, deletes the piece from one, adds piece to the other
     * 
     * @param {Piece} pieceToMove Piece() object that is to be moved
     * @param {string} refTarget 2 character string of the destination square reference
     */
    movePiece(pieceToMove, refTarget) {
        // Check if everything is good
        StaticErrorCheck.validateIsChessPiece(pieceToMove)
        StaticErrorCheck.validateCellRef(refTarget)

        // Clear contents of the current Square() and the destination Square()
        this.returnSquare(pieceToMove.positionRef).clearContents()
        this.returnSquare(refTarget).clearContents()

        // Update the destination Square() with the Piece()
        this.returnSquare(refTarget).setPiece(pieceToMove)
    };


    /**
     * Performs Castling, where the Rook and the King/Queen both move at the same time.
     * 
     * @param {string} teamNum Team Number. 0 = White, 1 = Black
     * @param {string} castlingSide The type of castling. Either "Kingside" or "Queenside"
     */
    performCastling(teamNum, castlingSide) {
        StaticErrorCheck.validateTeamNumber(teamNum);
        StaticErrorCheck.validateCastlingCommand(castlingSide);

        const key = `${teamNum}_${castlingSide}`;
        const castlingInstructions = {
             "0_Kingside":  {kingFrom: "e1", kingTo: "g1", rookFrom: "h1", rookTo: "f1"}
            ,"1_Kingside":  {kingFrom: "e8", kingTo: "g8", rookFrom: "h8", rookTo: "f8"}
            ,"0_Queenside": {kingFrom: "e1", kingTo: "c1", rookFrom: "a1", rookTo: "d1"}
            ,"1_Queenside": {kingFrom: "e8", kingTo: "c8", rookFrom: "a8", rookTo: "d8"}
        };
        const moves = castlingInstructions[key]

        StaticErrorCheck.validateContents(this.returnSquare(moves.kingFrom), King);
        StaticErrorCheck.validateContents(this.returnSquare(moves.rookFrom), Rook);

        const king = this.returnSquare(moves.kingFrom).piece;
        const rook = this.returnSquare(moves.rookFrom).piece;
        this.movePiece(king, moves.kingTo);
        this.movePiece(rook, moves.rookTo);
    };


    // Return a list of pieces that match criteria
    /**
     * filterBoardByAttribute - WIP
     */
    filterBoardByAttribute(code, attributeName, attributeValue) {
        const array = this.grid.map(row =>
            row.map(square => (square.piece instanceof Piece ? square.piece : null))
        ).flat();
        return array
            .filter(piece => piece && piece.pieceCodeStr === code)
            .filter(piece => piece[attributeName] === attributeValue);
    };


    /**
     * Get a 2d array of the Chessboard, with each element displaying a selected attribute of the Piece() object
     *
     * @param {string} attribute The attribute to retrieve for each piece.
     * @param {string} ifNull The value to use if the square doesn't contain a piece.
     * @returns {Array<Array<string>>} The 2d array representing the specified attribute for each piece on the board.
     */
    getArray(attribute, ifNull) {
        return this.grid.map(row =>
            row.map(square => (square.piece instanceof Piece ? square.piece[attribute] : ifNull))
        );
    };


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
    


    /**
     * Print the current board state to the terminal
     */
    printToTerminal() {

        const positionArray = this.getArray("code", "--")
        
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const nums = [7, 6, 5, 4, 3, 2, 1, 0];
      
        let board = '\n';
        board += '  │  0 │  1 │  2 │  3 │  4 │  5 │  6 │  7 │\t  │  a │  b │  c │  d │  e │  f │  g │  h │\n';

      
        for (let rank = 7; rank >= 0; rank--) {
            board += `──│────│────│────│────│────│────│────│────│\t──│────│────│────│────│────│────│────│────│\n`;
            board += `${nums[rank]} │`;

            for (let file of files) {
                const piece = positionArray[7 - rank][files.indexOf(file)];
                board += ` ${piece === '' ? '{}' : piece} │`;
            };

            board += '\t';

            let swapNum = StaticChessUtility.rowArrayToRef(nums[rank])

            board += `${swapNum} │`;

            for (let file of files) {
                let piece = positionArray[7 - rank][files.indexOf(file)];
                board += ` ${piece === '' ? '{}' : piece} │`;
            };

            board += '\n';
        };
      
        board += `──│────│────│────│────│────│────│────│────│\t──│────│────│────│────│────│────│────│────│\n`;
      
        console.log(board);
      };


    /**
     * Prints a grid of all the chess squares (and their 2 character string reference) to the terminal
     */
    printSquaresToTerminal() {

        // const positionArray = this.grid.map(row =>
        //     row.map(square => (square instanceof SquareFactory ? square.positionRef : "--"))
        // );

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const nums = [7, 6, 5, 4, 3, 2, 1, 0];
      
        let board = '\n';
      
        for (let rank = 7; rank >= 0; rank--) {
            board += `──│────│────│────│────│────│────│────│────│\n`;
            board += `${nums[rank]} │`;
        
            for (let file of files) {
                const piece = positionArray[7 - rank][files.indexOf(file)];
                board += ` ${piece === '' ? '{}' : piece} │`;
            };
        
            board += '\n';
        };
      
        board += `──│────│────│────│────│────│────│────│────│\n`;
        board += '  │  0 │  1 │  2 │  3 │  4 │  5 │  6 │  7 │\n';
      
        console.log(board);
    };


};


// This board is just for display. Its parent Game() object will have a click event for the entire object
class BoardDisplay extends BoardUsingFEN {
    constructor(idNumber, parentElement, fen) {
        console.log(`\t\tFunc: START constructor (BoardDisplay)`);
        super(idNumber, parentElement, fen);
        // console.log(idNumber)
        // console.log(fen)
        this.initSquares()              // Automatically creates the 64 Square() Objects into a 2d array
        this.initPieces(this.fen)               // Automatically creates the 24 Piece() Objects and appends them to a Square()
        this.createElement()            // Automatically creates the element
    }

    /**
     * Creates a Board() HTML object for the DOM
     */
    createElement() {
        this.element.className = `chessboard small`;
        this.element.id = `chessboard${this.idNumber+1}`;
        this.parentElement.appendChild(this.element);
    };

};


class BoardInteractive extends BoardUsingFEN {
    constructor(idNumber, parentElement, fen) {
        console.log(`\t\tFunc: START constructor (BoardInteractive)`);
        super(idNumber, parentElement, fen);
        this.initSquares()              // Automatically creates the 64 Square() Objects into a 2d array
        this.initPieces(this.fen)               // Automatically creates the 24 Piece() Objects and appends them to a Square()
        this.createElement()
    }
    /**
     * Creates a Board() HTML object for the DOM
     */
    createElement() {
        this.element.className = `chessboard large`;
        this.element.id = `chessboard${this.idNumber+1}`;
        this.parentElement.appendChild(this.element);
    };

}

export {BoardUsingFEN as Board, BoardDisplay, BoardInteractive};

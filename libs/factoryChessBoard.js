import ChessUtility from './factoryChessUtility.js';
import Square from "./factoryChessSquare.js";
import {
    Piece, Pawn, Rook, Knight, Bishop, Queen, King
} from "./factoryChessPiece.js";

class Board {
    #grid;
    constructor() {
        this.#grid = this.createEmptyGrid();
        this.initSquares();
        this.initPieces();
    };
    get grid() {
        return this.#grid;
    };
    set grid(value) {
        this.#grid = value;
    };

    // Create an empty grid
    createEmptyGrid() {
        return new Array(8).fill(null).map(() => new Array(8).fill(null));
    };

    // Initialize the squares on the board
    initSquares() {
        this.grid = Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => new Square(row, col))
        );
    };

    initPieces() {
        // Create Chess Pieces and place on board - White
        this.putPieceOnBoard(7, 0, new Rook(0));
        this.putPieceOnBoard(7, 1, new Knight(0));
        this.putPieceOnBoard(7, 2, new Bishop(0));
        this.putPieceOnBoard(7, 3, new Queen(0));
        this.putPieceOnBoard(7, 4, new King(0));
        this.putPieceOnBoard(7, 5, new Bishop(0));
        this.putPieceOnBoard(7, 6, new Knight(0));
        this.putPieceOnBoard(7, 7, new Rook(0));
        this.putPieceOnBoard(6, 0, new Pawn(0));
        this.putPieceOnBoard(6, 1, new Pawn(0));
        this.putPieceOnBoard(6, 2, new Pawn(0));
        this.putPieceOnBoard(6, 3, new Pawn(0));
        this.putPieceOnBoard(6, 4, new Pawn(0));
        this.putPieceOnBoard(6, 5, new Pawn(0));
        this.putPieceOnBoard(6, 6, new Pawn(0));
        this.putPieceOnBoard(6, 7, new Pawn(0));

        // Create Chess Pieces and place on board - Black
        this.putPieceOnBoard(0, 0, new Rook(1));
        this.putPieceOnBoard(0, 1, new Knight(1));
        this.putPieceOnBoard(0, 2, new Bishop(1));
        this.putPieceOnBoard(0, 3, new Queen(1));
        this.putPieceOnBoard(0, 4, new King(1));
        this.putPieceOnBoard(0, 5, new Bishop(1));
        this.putPieceOnBoard(0, 6, new Knight(1));
        this.putPieceOnBoard(0, 7, new Rook(1));
        this.putPieceOnBoard(1, 0, new Pawn(1));
        this.putPieceOnBoard(1, 1, new Pawn(1));
        this.putPieceOnBoard(1, 2, new Pawn(1));
        this.putPieceOnBoard(1, 3, new Pawn(1));
        this.putPieceOnBoard(1, 4, new Pawn(1));
        this.putPieceOnBoard(1, 5, new Pawn(1));
        this.putPieceOnBoard(1, 6, new Pawn(1));
        this.putPieceOnBoard(1, 7, new Pawn(1));

        this.updatePiecePositions()
    };

    // Update the positions of all pieces on the board
    updatePiecePositions() {
        this.grid.flat().forEach(square => {
            if (square.contains instanceof Piece) {
                const { row, col } = square;
                square.contains.setPosition(row, col);
            }
        });
    };

    // Put a piece on the board
    putPieceOnBoard(row, col, piece) {
        this.validatePosition(row, col);
        this.validateChessPiece(piece);

        // Add Piece() object to Square() object
        this.grid[row][col].contains = piece;
    };

    
    // Remove a piece from the board
    removePieceFromBoard(row, col) {
        this.validatePosition(row, col);
        this.validatePiecePresenceArray(row, col);

        // Remove the piece from the square
        this.grid[row][col].contains = null;
    };


    getSquareArray() {
        return this.grid.map(row =>
            row.map(square => (square instanceof Square ? square.pos : null))
        );
    };

    
    getPieceArray() {
        return this.grid.map(row =>
            row.map(square => (square.contains instanceof Piece ? square.contains : null))
        );
    };


    isSquareEmpty(row, col) {
        return !this.grid[row][col];
    };


    // teamNum: 0 = White, 1 = Black
    performCastling(teamNum, castlingSide) {
        if (teamNum === 0 && castlingSide === "Kingside") {
            this.deletePieceFromRef("e1");  // King
            this.deletePieceFromRef("h1");  // Rook
            this.putPieceOnBoard(7, 5, new Rook(0));
            this.putPieceOnBoard(7, 6, new King(0));
            this.updatePiecePositions();
        };
        if (teamNum === 1 && castlingSide === "Kingside") {
            this.deletePieceFromRef("e8");  // King
            this.deletePieceFromRef("h8");  // Rook
            this.putPieceOnBoard(0, 5, new King(1));
            this.putPieceOnBoard(0, 6, new Rook(1));
            this.updatePiecePositions();
        };
        if (teamNum === 0 && castlingSide === "Queenside") {
            this.deletePieceFromRef("e1");  // King
            this.deletePieceFromRef("a1");  // Rook
            this.putPieceOnBoard(7, 2, new King(0));
            this.putPieceOnBoard(7, 3, new Rook(0));
            this.updatePiecePositions();
        };
        if (teamNum === 1 && castlingSide === "Queenside") {
            this.deletePieceFromRef("e8");  // King
            this.deletePieceFromRef("a8");  // Rook
            this.putPieceOnBoard(0, 2, new King(1));
            this.putPieceOnBoard(0, 3, new Rook(1));
            this.updatePiecePositions();
        };
    };

    // Return a piece from a specific board position
    getPieceFromArray(row, col) {
        this.validatePiecePresenceArray(row, col);
        return this.grid[row][col].contains;
    };

    // Return a piece from a reference
    returnPieceFromRef(ref) {
        const [row, col] = ChessUtility.chessRefToArrayPos(ref)
        return this.getPieceFromArray(row,col)
    };

    // Delete a piece from a reference
    // TODO: This doesnt need to be a function if we have "deletePieceFromBoard" and the ChessUtility
    // Also, "removePieceFromBoard" exists and can be deleted or merged with these functions
    deletePieceFromRef(ref) {
        const pieceToDelete = this.returnPieceFromRef(ref);

        // should be using a validation error

        if (!pieceToDelete) {
            throw new Error(`ref: ${ref} | No piece found on delete attempt`);
        };

        // If you've already returned pieceFromRef, you don't need to loop through the entire board
        this.deletePieceFromBoard(pieceToDelete);
    };

    // Delete a piece from the board
    deletePieceFromBoard(pieceToDelete) {
        const piece = this.grid.flat().find(piece => piece.contains === pieceToDelete);
        if (piece) {
            piece.contains.clearData();
            piece.contains = null;
        };
    };


    filterBoardByAttribute(code, attributeName, attributeValue) {
        // console.log(`code=${code}  ||  attributeName=${attributeName}  ||  attributeValue=${attributeValue}`)
        const flatArray = [].concat(...this.getPieceArray());
        return flatArray
            .filter((square) => square === null ? "" : square.pieceCodeStr === code)
            .filter((piece) => piece[attributeName]  === attributeValue)
    };


    // Validate a square position
    validatePosition(row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7) {
            throw new Error(`Invalid square position: row ${row}, col ${col}`);
        };
    };


    // Validate a chess piece
    validateChessPiece(piece) {
        if (!(piece instanceof Piece)) {
            throw new Error(`Object is not a valid chess piece: ${piece.name}`);
        };
    };


    // Validate presence of a piece on the board - array
    validatePiecePresenceArray(row, col) {
        if (!(this.grid[row][col].contains instanceof Piece)) {
            throw new Error(`No piece to remove at: row ${row}, col ${col}`
            ,this.printToTerminal());
        };
    };


    // Validate presence of a piece on the board - string reference
    validatePiecePresence(row, col) {
        if (!(this.grid[row][col].contains instanceof Piece)) {
            throw new Error(`No piece to remove at: row ${row}, col ${col}`, this.printToTerminal());
        }
    }


    // Print the current board state to the terminal
    printToTerminal() {
        const positionArray = this.grid.map(row =>
            row.map(square => (square.contains instanceof Piece ? square.contains.code : "--"))
        );

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

            let swapNum = ChessUtility.rowArrayToRef(nums[rank])

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


    // Print square locations to the terminal
    printSquaresToTerminal() {

        const positionArray = this.grid.map(row =>
            row.map(square => (square instanceof Square ? square.pos : "--"))
        );

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

export default Board;

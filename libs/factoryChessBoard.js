import ChessUtility from './factoryChessUtility.js';
import Square from "./factoryChessSquare.js";
import {
    Piece, Pawn, Rook, Knight, Bishop, Queen, King
} from "./factoryChessPiece.js";

class Board {
    #grid;
    constructor() {
        this.#grid = []
        this.initSquares();
        this.initPieces();
    };
    get grid() {
        return this.#grid;
    };
    set grid(value) {
        this.#grid = value;
    };

    // Initialize the squares on the board
    initSquares() {
        this.grid = Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => new Square(row, col))
        );
    };

    // Initialize the pieces on the board
    initPieces() {
        // Create Chess Pieces and place on board - White
        this.putPieceFromRef(new Rook(0), "a1");
        this.putPieceFromRef(new Knight(0), "b1");
        this.putPieceFromRef(new Bishop(0), "c1");
        this.putPieceFromRef(new Queen(0), "d1");
        this.putPieceFromRef(new King(0), "e1");
        this.putPieceFromRef(new Bishop(0), "f1");
        this.putPieceFromRef(new Knight(0), "g1");
        this.putPieceFromRef(new Rook(0), "h1");

        this.putPieceFromRef(new Pawn(0), "a2");
        this.putPieceFromRef(new Pawn(0), "b2");
        this.putPieceFromRef(new Pawn(0), "c2");
        this.putPieceFromRef(new Pawn(0), "d2");
        this.putPieceFromRef(new Pawn(0), "e2");
        this.putPieceFromRef(new Pawn(0), "f2");
        this.putPieceFromRef(new Pawn(0), "g2");
        this.putPieceFromRef(new Pawn(0), "h2");
        
        // Create Chess Pieces and place on board - Black
        this.putPieceFromRef(new Rook(1), "a8");
        this.putPieceFromRef(new Knight(1), "b8");
        this.putPieceFromRef(new Bishop(1), "c8");
        this.putPieceFromRef(new Queen(1), "d8");
        this.putPieceFromRef(new King(1), "e8");
        this.putPieceFromRef(new Bishop(1), "f8");
        this.putPieceFromRef(new Knight(1), "g8");
        this.putPieceFromRef(new Rook(1), "h8");

        this.putPieceFromRef(new Pawn(1), "a7");
        this.putPieceFromRef(new Pawn(1), "b7");
        this.putPieceFromRef(new Pawn(1), "c7");
        this.putPieceFromRef(new Pawn(1), "d7");
        this.putPieceFromRef(new Pawn(1), "e7");
        this.putPieceFromRef(new Pawn(1), "f7");
        this.putPieceFromRef(new Pawn(1), "g7");
        this.putPieceFromRef(new Pawn(1), "h7");
    };

    // Returns a square on the chessboard
    returnSquare(ref) {
        return this.grid.flat().find(square => square.positionRef === ref)
    };

    // Gets the two squares, deletes the piece from one, adds piece to the other
    movePiece(pieceToMove, refTarget) {
        this.returnSquare(pieceToMove.positionRef).clearPiece()
        this.returnSquare(refTarget).setPiece(pieceToMove)
    };

    // Places piece on chessboard. Used for the opening function. Could be removed?
    putPieceFromRef(piece, ref) {
        this.returnSquare(ref).setPiece(piece)
    };

    // Get array of all piece attributes in their board position
    getArray(attribute, ifNull) {
        return this.grid.map(row =>
            row.map(square => (square.contains instanceof Piece ? square.piece[attribute] : ifNull))
        );
    };


    performCastling(teamNum, castlingSide) {
        if (teamNum === 0 && castlingSide === "Kingside") {
            const king = this.returnSquare("e1").piece;
            this.movePiece(king, "g1");
            const rook = this.returnSquare("h1").piece;
            this.movePiece(rook, "f1");
        };
        if (teamNum === 1 && castlingSide === "Kingside") {
            const king = this.returnSquare("e8").piece;
            this.movePiece(king, "g8");
            const rook = this.returnSquare("h8").piece;
            this.movePiece(rook, "f8");
        };
        if (teamNum === 0 && castlingSide === "Queenside") {
            const king = this.returnSquare("e1").piece;
            this.movePiece(king, "d1");
            const rook = this.returnSquare("a1").piece;
            this.movePiece(rook, "c1");
        };
        if (teamNum === 1 && castlingSide === "Queenside") {
            const king = this.returnSquare("e8").piece;
            this.movePiece(king, "d8");
            const rook = this.returnSquare("a8").piece;
            this.movePiece(rook, "c8");
        };
    };


    // Return a list of pieces that match criteria
    filterBoardByAttribute(code, attributeName, attributeValue) {
        const array = this.grid.map(row =>
            row.map(square => (square.piece instanceof Piece ? square.piece : null))
        ).flat();
        return array
            .filter(piece => piece && piece.pieceCodeStr === code)
            .filter(piece => piece[attributeName] === attributeValue);
    };


    validateContents(squareRef, whatClass) {
        const square = this.grid.flat().find(square => square.positionRef === squareRef)
        if (!(square && square.piece instanceof whatClass)) {
            throw new Error(`Contents of square ${squareRef} are not an instance of ${whatClass.name}`);
        };
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

    
    // Print the current board state to the terminal
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
            row.map(square => (square instanceof Square ? square.positionRef : "--"))
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

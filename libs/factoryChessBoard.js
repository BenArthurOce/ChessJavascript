import Square from "./factoryChessSquare.js";
import {
    Piece
    , Pawn
    , Rook
    , Knight
    , Bishop
    , Queen
    , King
} from "./factoryChessPiece.js";

class Board {
    #grid;
    #rows;
    #cols;
    constructor() {
        this.#grid = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.initSquares();
        this.initPieces();
    };
    get grid() {
        return this.#grid
    };

    initSquares() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // Determine the colour of the square based on row and column
                const colour = (row + col) % 2 === 0 ? 'white' : 'black';

                // Create a new Square instance and add it to the grid
                this.grid[row][col] = new Square(row, col, colour);
            };
        };
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
        // this.putPieceOnBoard(4, 0, new Rook(0));
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

    updatePiecePositions() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let mySquare = this.grid[row][col]
                // let myPiece = mySquare.contains
                if (mySquare.contains instanceof Piece) {
                    mySquare.contains.updatePosition(row, col)
                }
            }
        };
        // for (let row = 0; row < 8; row++) {
        //     for (let col = 0; col < 8; col++) {

        //     }
        // }
    };


    // This should probably be combined with the print function
    getPositionArray() {
        const newArray = this.grid.map(function(row) {
            return row.map(function(square) {
                if (square.contains instanceof Piece) {
                    return square.contains.code
                } else {
                    return "--"
                };
            });
        });
        return newArray;
    };

    getPieceArray() {
        const newArray = this.grid.map(function(row) {
            return row.map(function(square) {
                if (square.contains instanceof Piece) {
                    return square.contains
                } else {
                    return null
                };
            });
        });
        return newArray;
    };


    putPieceOnBoard(row, col, piece) {
        // console.log(piece)
        // Add error check to make sure row and col are acceptable values
        if ((row < 0 || row > 7) || (col < 0 || col > 7)) {
            throw new Error(
                `row: ${row} | col: ${col} | piece.name: ${piece.name} | Not a valid square position`
                , this.printToTerminal()
            )
        };

        // Add error check to make sure that its a chess piece
        //.prototype instanceof
        if (piece instanceof Piece === false) {
            // throw new Error(`Object attempting to add to board is not a Piece`)
            throw new Error(
                `row: ${row} | col: ${col} | piece.name: ${piece.name} | Object attempting to add to board is not a Piece`
                , this.printToTerminal()
            )
        };

        // Add Piece() object to Square() object
        this.grid[row][col].contains = piece;
    };

    removePieceFromBoard(row, col) {

        if ((row === undefined) || (col === undefined)) {
            throw new Error(`row: ${row} | col: ${col} | undefined argument found`)
        };

        // Add error check to make sure row and col are acceptable values
        if ((row < 0 || row > 7) || (col < 0 || col > 7)) {
            throw new Error(`row: ${row} | col: ${col} | is not a valid square position`)
        };

        // Add error check to make there is a Piece() being removed
        if (this.grid[row][col].contains instanceof Piece == false) {
            throw new Error(`row: ${row} } col: ${col} | contains no piece to be removed`)
        };

        this.grid[row][col].contains = null;
    };

    performCastlingKingside(teamNum) {
        if (teamNum === 0) {
            this.deletePieceFromRef("e1");
            this.deletePieceFromRef("h1");

            this.putPieceOnBoard(7, 5, new Rook(0));
            this.putPieceOnBoard(7, 6, new King(0));
            this.updatePiecePositions();
        };
        if (teamNum === 1) {

            
            this.deletePieceFromRef("e8");
            this.deletePieceFromRef("h8");

            // Code needs fixing
            // this.addPieceFromRef("g8", new King(1))
            // this.addPieceFromRef("f8", new Rook(1))

            this.putPieceOnBoard(0, 5, new King(1));
            this.putPieceOnBoard(0, 6, new Rook(1));
            this.updatePiecePositions();

        };
    };

    performCastlingQueenside(teamNum) {
        if (teamNum === 0) {}
        if (teamNum === 1) {}
    };

    returnPieceFromBoardPosition(row, col) {
        if ((row < 0 || row > 7) || (col < 0 || col > 7)) {
            throw new Error(`row: ${row}, col: ${col} is not a valid square position`);
        };

        // Add error check to make there is a Piece() being found
        if (this.grid[row][col].contains instanceof Piece == false) {
            throw new Error(`row: ${row}, col: ${col} contains no piece to be returned`);
        };

        return this.grid[row][col].contains;
    };

    getPieceFromRef(ref) {
        // Get grid of every piece and converts to a 1d array
        const positionArray = this.getPieceArray();
        const flatArray = [].concat(...positionArray);

        const filteredPieces = flatArray.filter(piece => piece && piece.notPos === ref);
        return filteredPieces[0]
    };



    addPieceFromRef(ref, piece) {

        if (piece instanceof Piece === false) {
            throw new Error(`ref: ${ref} | piece: ${piece} | piece argument provided is not a Piece Object`);
        };

        const boardToRow = {0:8, 1:7, 2:6, 3:5, 4:4, 5:3, 6:2, 7:1, 8:0};
        const rowToBoard = {8:0, 7:1, 6:2, 5:3, 4:4, 3:5, 2:6, 1:7, 0:8};
        
        const boardtoCol = {'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7};
        const coltoBoard = {0:'a', 1:'b', 2:'c', 3:'d', 4:'e', 5:'f', 6:'g', 7:'h'};

        const row = boardToRow[ref[1]]
        const col = boardtoCol[ref[0]]

        this.grid[row][col].contents = piece
    }


    deletePieceFromRef(ref) {
        
        const pieceToDelete = this.getPieceFromRef(ref);
        if (!pieceToDelete) {throw new Error(`ref: ${ref} | No piece found on delete attempt`)}


        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.grid[row][col].contains === pieceToDelete) {
                    this.grid[row][col].contains.clearData();
                    this.grid[row][col].contains = null;
                    return
                };
                
            };
            
        };
        // throw new Error(`ref: ${ref} | No piece found on delete attempt`)
    };


    filterArrayByAttribute(array, attributeName, attributeValue) {
        return array
            .map(row => row.filter(obj => obj[attributeName] === attributeValue))
            .filter(row => row.length > 0);
    };


    filterBoardByPiece(whatPiece, whatTeam) {

        if (whatPiece.prototype instanceof Piece === false) {
            throw new Error(`filterBoardByPiece contains no piece to be returned`);
        };

        if (whatTeam ===! 0 && whatTeam ===! 1) {
            throw new Error(`filterBoardByPiece: team number provided: ${whatTeam} is not permitted`)
        }

        // Get grid of every piece and converts to a 1d array
        const positionArray = this.getPieceArray();
        const flatArray = [].concat(...positionArray);
        
        const filteredPieces = flatArray.filter(piece => piece && piece.name === whatPiece.name);
        const filteredTeamPieces = filteredPieces.filter((piece2) => piece2.team === whatTeam);

        if (filteredTeamPieces.length === 0) {
            throw new Error(
                `filtered list returned no results. piece: ${whatPiece}, team: ${whatTeam}`
                , this.printToTerminal()
                )
        };

        return filteredTeamPieces
    };

    printAllPiecesToTerminal() {
        const positionArray = this.getPieceArray();
        const flatArray = [].concat(...positionArray);
        console.log(flatArray)

    }

    printToTerminal() {
        const positionArray = this.getPositionArray();
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const nums = [7, 6, 5, 4, 3, 2, 1, 0];

        let board = '\n';

        for (let rank = 7; rank >= 0; rank--) {
            board += `──│────│────│────│────│────│────│────│────│\n`;
            board += `${nums[rank]} │`;

            for (let file of files) {
                const piece = positionArray[7 - rank][files.indexOf(file)];
                board += ` ${piece === '' ? '{}' : piece} │`;
            }

            board += '\n';
        }

        board += `──│────│────│────│────│────│────│────│────│\n`;
        board += '  │  0 │  1 │  2 │  3 │  4 │  5 │  6 │  7 │\n';

        //        board += '  │  a │  b │  c │  d │  e │  f │  g │  h │\n';

        console.log(board);
    };


};

export default Board;
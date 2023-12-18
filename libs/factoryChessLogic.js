import ChessUtility from './factoryChessUtility.js';
import Parser from './factoryChessParser.js';
import Board from './factoryChessBoard.js';
import {
    Piece
    , Pawn
    , Rook
    , Knight
    , Bishop
    , Queen
    , King
} from './factoryChessPiece.js';

class Logic {
    #gameNotation;
    #parser;
    #gameBoard;
    constructor(gameNotation) {
        this.#gameNotation = gameNotation;
        this.#parser = new Parser(gameNotation);
        this.#gameBoard = new Board();
    };
    get gameNotation() {
        return this.#gameNotation;
    };
    set gameNotation(value) {
        this.#gameNotation = value;
    };
    get parser() {
        return this.#parser;
    };
    set parser(value) {
        this.#parser = value;
    };
    get gameBoard() {
        return this.#gameBoard;
    };
    set gameBoard(value) {
        this.#gameBoard = value;
    };


    processAllMoves() {
        for (const [turn_num, [whiteMoveInst, blackMoveInst]] of Object.entries(this.parser)) {
            if (whiteMoveInst) {
                this.processPlayerMove(0, whiteMoveInst);
            };
            if (blackMoveInst) {
                this.processPlayerMove(1, blackMoveInst);
            };
            if (!whiteMoveInst && !blackMoveInst) {
                throw new Error (
                    `processAllMoves: a move on turn ${turn_num} was not found`
                );
            };
        };
    };


    processPlayerMove(teamNum, moveInst) {
        try {
            if (!moveInst) {
                throw new Error('processPlayerMove: moveInst is null');
            };

            // If there was a castling move, perform it and then leave function
            if (moveInst.castlingSide) {
                this.gameBoard.performCastling(teamNum, moveInst.castlingSide);
                return;
            };

            // Find the location of the piece
            let pieceLocated = this.findLocation(moveInst, teamNum);
            if (!pieceLocated) {
                throw new Error(`Piece not found for team ${teamNum}`);
            };

            // Move / update the piece position
            this.movePiece(pieceLocated, moveInst.targetPosX, moveInst.targetPosY);
            this.gameBoard.updatePiecePositions();
        } catch (error) {
            this.handleError(error, moveInst);
        }
    };


    findLocation(moveInfo) {
        let foundPiece = null
        const letter = moveInfo.pieceCode;
        if (letter === null) {
            throw new Error('findLocation failed to return a piece letter');
        };

        const searchItem = this.getPieceType(letter);
        if (!searchItem) {
            throw new Error(`Piece not found for letter: ${letter}`, this.parser.printToTerminal(moveInfo));
        };

        // Get a list of all the pieces that match the team number, and the type of piece
        const possiblePieces = this.gameBoard.filterBoardByAttribute(letter, 'team', moveInfo.teamNumber);

        // Loop through all possible pieces to determine which piece could have moved to the destination square
        foundPiece = possiblePieces.find(piece => piece.isValidMove(moveInfo.targetArray, moveInfo));

        if (!foundPiece) {
            throw new Error(
                'Piece not found'
                , moveInfo.printToTerminal()
                , this.gameBoard.printToTerminal()
            );
        }
        return foundPiece;
    };


    movePiece(pieceToMove, destX, destY) {
        if (!(pieceToMove instanceof Piece)) {
            throw new Error(`Object is not a valid chess piece: ${piece.name}`);
        };

        const pieceLocation = pieceToMove.arrPos
        this.gameBoard.removePieceFromBoard(pieceLocation[0], pieceLocation[1]);
        this.gameBoard.putPieceOnBoard(destX, destY, pieceToMove);
    };


    getPieceType(letter) {
        const moveMap = new Map([
            ['p', Pawn]
            , ['R', Rook]
            , ['N', Knight]
            , ['B', Bishop]
            , ['Q', Queen]
            , ['K', King]
        , ]);

        const searchItem = moveMap.get(letter);
        if (!searchItem) {
            throw new Error(`Piece not found for letter: ${letter}`);
        }
        return searchItem;
    };


    handleError(error, moveInst) {
        console.error('Error:', error.message);
        console.error('Move Instruction Details:', moveInst.printToTerminal());
        console.error('Game Board Details:', this.gameBoard.printToTerminal());
        throw error;
    };
};

export default Logic;
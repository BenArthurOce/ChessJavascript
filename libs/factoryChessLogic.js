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

    processMoves() {
        for (const [turn_num, eachMove] of Object.entries(this.parser)) {

            const whiteMoveInst = eachMove[0];
            const blackMoveInst = eachMove[1];

            if (!whiteMoveInst || !blackMoveInst) {
                throw new TypeError(`turn_num: ${turn_num} | move instructions failed to return`);
            };

            // If there is castling, do it and then leave the loop
            if (whiteMoveInst.get('castling-side')) { this.gameBoard.performCastling(0, whiteMoveInst.get('castling-side')); continue}
            if (blackMoveInst.get('castling-side')) { this.gameBoard.performCastling(1, blackMoveInst.get('castling-side')); continue}

            // Find the location of the white piece
            let whitePieceLocated = this.findLocation(whiteMoveInst)
            if (whitePieceLocated === null) {
                throw new Error(
                    `whitePieceLocated was not found`
                    ,whiteMoveInst.printToTerminal()
                    ,this.gameBoard.printToTerminal()
                );
            };

            // Find the location of the black piece
            let blackPieceLocated = this.findLocation(blackMoveInst)
            if (blackPieceLocated === null) {
                throw new Error(
                    `blackPieceLocated was not found`
                    ,blackMoveInst.printToTerminal()
                    ,this.gameBoard.printToTerminal()
                );
            };

            // After finding the pieces, move / update their positions
            this.movePiece(whitePieceLocated, whiteMoveInst.get('dest-posX'), whiteMoveInst.get('dest-posY'));
            this.movePiece(blackPieceLocated, blackMoveInst.get('dest-posX'), blackMoveInst.get('dest-posY'));
            this.gameBoard.updatePiecePositions();
        };
    };


    findLocation(moveInfo) {
        const letter = moveInfo.get('piece');
        if (letter === null) {
            throw new Error('findLocation failed to return a piece letter');
        };

        const searchItem = this.getPieceType(letter);
        if (!searchItem) {
            throw new Error(`Piece not found for letter: ${letter}`, this.parser.printToTerminal(moveInfo));
        };

        
        // Get a list of all the pieces that match the team number, and the type of piece
        const possiblePieces = this.gameBoard.filterBoardByAttribute(letter, 'team', moveInfo.get('team-num'));

        // Loop through all of the possible pieces to determine which piece could have moved to the destination square
        for (const piece of possiblePieces) {
            if (piece.isValidMove(moveInfo.get('destinationArr'), moveInfo)) {
                return piece}
        };

        // Add an error log
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
};

export default Logic;
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
    }

    get gameNotation() {
        return this.#gameNotation;
    }

    set gameNotation(value) {
        this.#gameNotation = value;
    }

    get parser() {
        return this.#parser;
    }

    set parser(value) {
        this.#parser = value;
    }

    get gameBoard() {
        return this.#gameBoard;
    }

    set gameBoard(value) {
        this.#gameBoard = value;
    }

    getMoveDetail(turnNum, teamNum) {
        return this.parser[turnNum][teamNum];
    }

    movePiece(pieceToMove, destX, destY) {
        if (!(pieceToMove instanceof Piece)) {
            throw new Error(`Object is not a valid chess piece: ${piece.name}`);
        };


        const pieceLocation = pieceToMove.arrPos
        // const pieceToMove = this.gameBoard.getPieceFromArray(pieceLocation[0], pieceLocation[1]);
        this.gameBoard.removePieceFromBoard(pieceLocation[0], pieceLocation[1]);
        this.gameBoard.putPieceOnBoard(destX, destY, pieceToMove);
    }


    processMoves() {
        this.parser.printToTerminal();

        for (const [turn_num, eachMove] of Object.entries(this.parser)) {

            console.log(Object.entries(this.parser))
            console.log("eachMove")
            console.log(eachMove)
            const whitemoveInfoructions = eachMove[0];
            const blackmoveInfoructions = eachMove[1];

            if (!whitemoveInfoructions || !blackmoveInfoructions) {
                throw new TypeError(`turn_num: ${turn_num} | move instructions failed to return`);
            }

            if (whitemoveInfoructions.get('castling-side')) { this.gameBoard.performCastling(0, whitemoveInfoructions.get('castling-side')); continue}
            if (blackmoveInfoructions.get('castling-side')) { this.gameBoard.performCastling(1, blackmoveInfoructions.get('castling-side')); continue}


            let whitePieceLocated = this.findLocation(whitemoveInfoructions, 1);
            if (whitePieceLocated === null) {
                throw new Error(
                    `whitePieceLocated was not found`
                    ,whitemoveInfoructions.printToTerminal()
                    ,this.gameBoard.printToTerminal()
                );
            }

            let blackPieceLocated = this.findLocation(blackmoveInfoructions, 1);
            if (blackPieceLocated === null) {
                throw new Error(
                    `blackPieceLocated was not found`
                    ,blackmoveInfoructions.printToTerminal()
                    ,this.gameBoard.printToTerminal()
                );
            };

            // console.log('whitePieceLocated location: ', whitePieceLocated);
            // whitePieceLocated = blackPieceLocated.arrPos;
            // console.log('black location: ', blackPieceLocated);
            // blackPieceLocated = blackPieceLocated.arrPos;

            if (!whitePieceLocated) {
                throw new Error("whitePieceLocated returned null location"
                ,whitemoveInfoructions.printToTerminal()
                ,this.gameBoard.printToTerminal())
            }

            if (!blackPieceLocated) {
                throw new Error("blackPieceLocated returned null location"
                ,blackmoveInfoructions.printToTerminal()
                ,this.gameBoard.printToTerminal())
            }
            


            this.movePiece(whitePieceLocated, whitemoveInfoructions.get('dest-posX'), whitemoveInfoructions.get('dest-posY'));
            this.movePiece(blackPieceLocated, blackmoveInfoructions.get('dest-posX'), blackmoveInfoructions.get('dest-posY'));
            this.gameBoard.updatePiecePositions();
        };
    };


    findLocation(moveInfo, teamNum) {
        moveInfo.printToTerminal()
        const letter = moveInfo.get('piece');
        if (letter === null) {
            throw new Error('findLocation failed to return a piece letter');
        }

        const searchItem = this.getPieceType(letter);

        if (!searchItem) {
            throw new Error(`Piece not found for letter: ${letter}`, this.parser.printToTerminal(moveInfo));
        }

        const destCoord = moveInfo.get('destinationArr');
        
        const possiblePieces = this.gameBoard.filterBoardByAttribute(letter, 'team', moveInfo.get('team-num'));

        if (letter === 'p') {
            console.log("hi")
            for (const piece of possiblePieces) {
                console.log(piece)
                if (piece.isPawnMoveValid(destCoord, moveInfo)) {
                    console.log("hi2")
                    return piece}
            };
        } else {
            for (const piece of possiblePieces) {
                console.log(piece)
                if (piece.isValidMove(destCoord, moveInfo)) {
                    console.log("hi2")
                    return piece}
            };
        };
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
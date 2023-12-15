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

    movePiece(startLocation, destX, destY) {
        const pieceToMove = this.gameBoard.returnPieceFromBoardPosition(startLocation[0], startLocation[1]);
        this.gameBoard.removePieceFromBoard(startLocation[0], startLocation[1]);
        this.gameBoard.putPieceOnBoard(destX, destY, pieceToMove);
    }

    handleCastling(moveInstructions, teamNum) {
        const castlingSide = moveInstructions.get('castling-side');
        if (['Kingside', 'Queenside'].includes(castlingSide)) {
            this.gameBoard.performCastling(teamNum, castlingSide);
        }
    }

    processMoves() {
        this.parser.printParserToTerminal();

        for (const [turn_num, movesArray] of Object.entries(this.parser)) {
            const whiteMoveInstructions = this.getMoveDetail(turn_num, 0);
            const blackMoveInstructions = this.getMoveDetail(turn_num, 1);

            if (!whiteMoveInstructions || !blackMoveInstructions) {
                throw new TypeError(`turn_num: ${turn_num} | move instructions failed to return`);
            }

            if (whiteMoveInstructions.get('castling-side') || blackMoveInstructions.get('castling-side')) {
                this.handleCastling(whiteMoveInstructions, 0);
                this.handleCastling(blackMoveInstructions, 1);
                continue;
            }

            let whiteLocation = this.findLocation(whiteMoveInstructions, 0);
            // console.log('white location: ', whiteLocation);
            whiteLocation = whiteLocation.arrPos;
            // console.log('white location: ', whiteLocation);

            let blackLocation = this.findLocation(blackMoveInstructions, 1);
            if (blackLocation === null) {
                throw new Error(
                    `blackLocation was not found`
                    ,this.parser.printMapToTerminal(blackMoveInstructions)
                    ,this.gameBoard.printToTerminal()
                );
            }


            
            // console.log('black location: ', blackLocation);
            blackLocation = blackLocation.arrPos;
            // console.log('black location: ', blackLocation);

            if (!whiteLocation || !blackLocation) {
                throw new TypeError(`turn_num ${turn_num} returned null location`);
            }

            this.movePiece(whiteLocation, whiteMoveInstructions.get('dest-posX'), whiteMoveInstructions.get('dest-posY'));
            this.movePiece(blackLocation, blackMoveInstructions.get('dest-posX'), blackMoveInstructions.get('dest-posY'));

            this.gameBoard.updatePiecePositions();
        }
    }

    getFileRankDifference(moveInst, piece) {
        const fileDiff = piece.arrPos[0] - moveInst.get('destinationArr')[0];
        const rankDiff = piece.arrPos[1] - moveInst.get('destinationArr')[1];
        return [fileDiff, rankDiff];
    }

    isPawnMoveValid(pawn, moveInfo) {
        // console.log(pawn);
        // console.log('pawn.arrPos', pawn.arrPos);
        // console.log('dest-pos', moveInfo.get('destinationArr'));
        const fileDiff = Math.abs(pawn.arrPos[0] - moveInfo.get('destinationArr')[0]);
        const rankDiff = Math.abs(pawn.arrPos[1] - moveInfo.get('destinationArr')[1]);

        // console.log('fileRankDiff', [fileDiff, rankDiff]);

        if (moveInfo.get('is-capture') && fileDiff === 0 && rankDiff === 1) {
            console.log('yes its a capture');
            return true;
        }

        const isWhitePawn = moveInfo.get('team-num') === 0;
        const isBlackPawn = moveInfo.get('team-num') === 1;

        if ((isWhitePawn || isBlackPawn) && rankDiff === 0) {
            return true;
        }

        return false;
    }

    findMatchingArray(mainArray, arrayOfArrays) {
        // console.log(`mainArray: ${mainArray} || arrayOfArrays: ${arrayOfArrays}`);
        const matchingArray = arrayOfArrays.find(arr => arr.every((val, i) => val === mainArray[i]));
        return matchingArray !== undefined ? matchingArray : null;
    }

    findLocation(moveInst, teamNum) {
        const letter = moveInst.get('piece');
        if (letter === null) {
            throw new Error('findLocation failed to return a piece letter');
        }

        const searchItem = this.getPieceType(letter);

        if (!searchItem) {
            throw new Error(`Piece not found for letter: ${letter}`, this.parser.printMapToTerminal(moveInst));
        }

        const destCoord = moveInst.get('destinationArr');
        if (moveInst.get('loc-posX') || moveInst.get('loc-posY')) {
            
        }

        
        const possiblePieces = this.gameBoard.filterBoardByAttribute(letter, 'team', moveInst.get('team-num'));


        if (moveInst.get('loc-posX') || moveInst.get('loc-posY')) {

            console.log(destCoord)
            console.log(destCoord[1])
            console.log([moveInst.get('loc-posX'), moveInst.get('loc-posY') ])

            if (destCoord[1] === moveInst.get('loc-posY')) {
                throw new Error ("aaa")
            }
        }

        if (letter === 'p') {
            for (const piece of possiblePieces) {
                const legalMoves = piece.findLegalMoves();
                // console.log(legalMoves);

                const foundPiece = this.isPawnMoveValid(piece, moveInst);

                if (foundPiece) {
                    // console.log('yes');
                    return piece;
                }
            }
        }

        for (const piece of possiblePieces) {
            const legalMoves = piece.findLegalMoves();
            // console.log(legalMoves);

            const foundPiece = this.findMatchingArray(destCoord, legalMoves);

            if (foundPiece) {
                // console.log('yes');
                return piece;
            }
            // If a matching legal move was found, return it. Otherwise throw error
            // if (result !== null) {
            //     return result;
            // } else {
            //     throw new Error(
            //         `notation: ${moveInst.get('notation')} || destCoord: ${destCoord} || turnNum: ${moveInst.get('turn-num')} || teamNum: ${moveInst.get('team-num')}  returned no match`
            //         , this.gameBoard.printToTerminal()
            //         , console.log(possiblePieces)
            //     );
            // };
        }

        return null;
    }

    printLegalMoves(moveList) {
        console.log(moveList.map(([row, col]) => `${ChessUtility.colArrayToRef(col)}${ChessUtility.rowArrayToRef(row)}`));
    }

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
    }

    doubledUpFileOrRank(moveInst) {
        if (Number.isInteger(moveInst.get('loc-posY')) || Number.isInteger(moveInst.get('loc-posX'))) {
            const posX = moveInst.get('loc-posX');
            const posY = moveInst.get('loc-posY');

            let result = null;

            possiblePieces.forEach(piece => {
                piece.printToTerminal();
                if (piece.row === posX) {
                    result = piece.arrPos;
                    return;
                } else if (piece.col === posY) {
                    result = piece.arrPos;
                    return;
                }
            });

            return result;
        }
    }
}

export default Logic;
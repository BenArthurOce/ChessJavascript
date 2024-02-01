import ChessUtility from './factoryChessUtility.js';
import Parser from './factoryChessParser.js';
import Board from './factoryChessBoard.js';
import ErrorCheck from './factoryErrorCheck.js';
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
    get parser() {
        return this.#parser;
    };
    get gameBoard() {
        return this.#gameBoard;
    };


    /**
     * Loops through all the move instructions found in the Parser() object, and calls "processPlayerMove" on each move instruction
     *
     * @throws {Error} If move instructions for both black and white are non existent for that turn number
     */
    processAllMoves() {
        for (const [turnNum, [whiteMoveInfo, blackMoveInfo]] of Object.entries(this.parser)) {
            if (whiteMoveInfo) {
                this.processPlayerMove(0, whiteMoveInfo);
            }
            if (blackMoveInfo) {
                this.processPlayerMove(1, blackMoveInfo);
            }
            if (!whiteMoveInfo && !blackMoveInfo) {
                throw new Error(`processAllMoves: a move on turn ${turnNum} was not found`);
            }
        }
    };


    /**
     * Process a player's move based on the provided moveInfo.
     *
     * @param {string} teamNum Team Number. 0 = White, 1 = Black
     * @param {object} moveInfo Object Key/Value pair regarding the information about a single move
     * @throws {Error} @throws {Error} If moveInfo is null, not an object, a piece is not found, or an error occurs during the move.
     */
    processPlayerMove(teamNum, moveInfo) {
        // Attempt to move a Piece() object
        try {
            // Check if the moveInfo object contains move information
            if (!moveInfo || typeof moveInfo !== 'object') {
                throw new Error('processPlayerMove: moveInfo is null');
            }

            // If there was a castling move, perform it and then leave the function
            if (moveInfo.castlingSide) {
                this.gameBoard.performCastling(teamNum, moveInfo.castlingSide);
                return;
            }

            // Find the location of the piece as a 2 character string. If nothing found, return an error
            const pieceLocated = this.findLocation(moveInfo, teamNum);
            if (!pieceLocated) {
                throw new Error(`Piece not found || Turn: ${moveInfo.turnNumber} | MoveNum: ${moveInfo.teamNumber} | Notation: ${moveInfo.notation}`);
            }

            // Using "pieceLocated" and the move instructions, run the command to update the location of the Piece() object
            this.gameBoard.movePiece(pieceLocated, moveInfo.targetSquare);
        
        // If moving the Piece() object failed
        } catch (error) {
            this.handleError(error, moveInfo);
        }
    };


    /**
     * Finds the location of a chess piece based on the data within the "moveInfo" variable
     *
     * @param {object} moveInfo Object Key/Value pair regarding the information about a single move
     * @returns {Piece|null} The Piece() object that needs to be moved according to the moveInfo variable.
     * @throws {Error} If there is an issue with finding the piece or if it's not a valid chess piece.
     */
    findLocation(moveInfo) {
        let foundPiece = null   // If this remains null, an error will be triggered

        // Check that the code letter represents an actual Piece() object
        const searchItem = ChessUtility.codeToPieceObject(moveInfo.pieceCode);
        if (!searchItem) {
            throw new Error(`Piece not found for letter: ${moveInfo.pieceCode}`, this.parser.printToTerminal(moveInfo));
        };

        // Get a list of all the Piece() objects that match the team number, and its single character code letter (ie: K, Q, R, p)
        const possiblePieces = this.gameBoard.filterBoardByAttribute(moveInfo.pieceCode, 'team', moveInfo.teamNumber);

        // Loop through the Piece() objects and find their valid moves.
        // Determine if the valid moves for a single Piece() object matches the destination in the moveInfo variable
        foundPiece = possiblePieces.find(piece => piece.isValidMove(moveInfo.targetArray, moveInfo));

        // If no Piece() object that could move to the destination square was found, return an error
        if (!foundPiece) {
            throw new Error(`Piece not found || Turn: ${moveInfo.turnNumber} | MoveNum: ${moveInfo.teamNumber} | Notation: ${moveInfo.notation}`);
        }
        return foundPiece;
    };


    handleError(error, moveInfo) {
        console.error('Error:', error.message);
        console.error('Move Instruction Details:', moveInfo.printToTerminal());
        console.error('Game Board Details:', this.gameBoard.printToTerminal());
        throw error;
    };
};

export default Logic;
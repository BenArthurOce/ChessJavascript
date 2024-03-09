// import { Square, SquareFactory, SquareHTML } from './Square.js';
import Square from './Square.js';

import {
    Piece, Pawn, Rook, Knight, Bishop, Queen, King
} from "./Piece.js";

class StaticErrorCheck {

    /**
     * Handles an error by throwing it.
     *
     * @param {string} errorMessage - The error message to be thrown.
     * @throws {Error} Always throws an error with the specified message.
     * @private
     */
    static handleError(errorMessage) {
        throw new Error(errorMessage);
    };


    /**
     * Checks if team number is correct (Must be a 0 or a 1).
     *
     * @param {number} teamNum The team number. White = 0, Black = 1
     * @throws {Error} If the team number passed does not equal a 0 or a 1
     */
    static validateTeamNumber(teamNum) {
        if (!teamNum === 0 && !teamNum === 1) {
            StaticErrorCheck.handleError(`Supplied teamNum of ${teamNum} is invalid.`);
        };
    };


    /**
     * Checks if the castling command is correct (Must be "Kingside" or "Queenside").
     *
     * @param {string} castlingName The string to be checked. Must be "Kingside" or "Queenside"
     * @throws {Error} If the string passed is not either "Kingside" or "Queenside"
     */
    static validateCastlingCommand(castlingName) {
        if (!castlingName === "Kingside" && !castlingName === "Queenside") {
            StaticErrorCheck.handleError(`Supplied castlingName of ${castlingName} is invalid.`);
        };

        // Maybe add more code to validate piece locations?
    };


    /**
     * Checks if a 2 character string is a valid chess position
     *
     * @param {string} position The string position reference of the square ie: "a5".
     * @throws {Error} If the string provided is not a valid chessboard position
     */
    static validateCellRef(position) {
        if (typeof position !== 'string' || position.length !== 2) {
            StaticErrorCheck.handleError('Invalid input format for position.');
        }

        const [file, rank] = position;
        const validFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const validRanks = ['1', '2', '3', '4', '5', '6', '7', '8'];

        if (!validFiles.includes(file) || !validRanks.includes(rank)) {
            StaticErrorCheck.handleError('Invalid chess position.');
        }
    };


    /**
     * Checks if a 2-element array represents a valid chess position.
     *
     * @param {number[]} array The 2-element array position [col, row].
     * @throws {Error} If the array does not represent a valid chess position.
     */
    static validateArray(array) {
        const [col, row] = array;
        const isValidCol = col >= 0 && col <= 7;
        const isValidRow = row >= 0 && row <= 7;

        if (!(isValidCol && isValidRow)) {
            StaticErrorCheck.handleError('Invalid chess position in array.');
        }
    };
    

    /**
     * Checks if a Square() object contains a Piece().
     *
     * @param {Square} square The Square() object to validate.
     * @throws {Error} If the Square() does not contain a valid chess piece.
     */
    static validateSquareContainPiece(square) {
        if (!(square instanceof Square && square.piece)) {
            StaticErrorCheck.handleError('Invalid Square object or does not contain a valid chess piece.');
        }
    };


    /**
     * Validates if the contents of a square match a specific chess piece class.
     *
     * @param {Square} squareObj The Square() object to be checked
     * @param {Class} whatClass The required Piece() object that the Square() object needs to contain
     * @throws {Error} If the contents of the Square() object do not match the specified class.
     */
    static validateContents(squareObj, whatClass) {

        if (!(squareObj && squareObj.piece instanceof whatClass)) {
            StaticErrorCheck.handleError(`Contents of square ${squareObj.positionRef} are not an instance of ${whatClass.name}`);
        };
    };


    /**
     * Checks if a variable is a valid ChessPiece object.
     *
     * @param {Piece} piece The Piece() object to validate.
     * @throws {Error} If the parameter is not a valid Piece() object.
     */
    static validateIsChessPiece(piece) {
        if (!(piece instanceof Piece)) {
            StaticErrorCheck.handleError('Invalid chess piece object.');
        }
    };


    static validateMoveObject(moveObject) {
        if (typeof moveObject.teamNumber !== 'boolean') {
            throw new Error("Invalid team number type. It must be a boolean value.");
        }
    
        if (!(moveObject.teamNumber === false || moveObject.teamNumber === true)) {
            throw new Error("Invalid team number value. It must be either false or true.");
        }
    
        if (!(moveObject.notation.length > 0)) {
            throw new Error("Invalid notation. It must have a length greater than 0.");
        }
    
        if (!(moveObject.turnNumber > 0)) {
            throw new Error("Invalid turn number. It must be greater than 0.");
        }
    
        if (!(moveObject.pieceCode.length === 1)) {
            throw new Error("Invalid piece code length. It must be exactly 1 character long.");
        }
    
        if (!(moveObject.targetPosX >= 0)) {
            throw new Error("Invalid target position X. It must be greater than or equal to 0.");
        }
    
        if (!(moveObject.targetPosY >= 0)) {
            throw new Error("Invalid target position Y. It must be greater than or equal to 0.");
        }
    
        if (!(moveObject.fullPieceCode.length === 2)) {
            throw new Error("Invalid full piece code length. It must be exactly 2 characters long.");
        }
    
        if (!(moveObject.targetArray.length === 2)) {
            throw new Error("Invalid target array length. It must contain exactly 2 elements.");
        }
    
        if (!(moveObject.targetSquare.length === 2)) {
            throw new Error("Invalid target square length. It must be exactly 2 characters long.");
        }
    
        if (!(moveObject.Castling === "Kingside" || moveObject.Castling === "Queenside" || moveObject.Castling === false)) {
            throw new Error("Invalid Castling value. It must be either 'Kingside', 'Queenside', or false.");
        }
    };
};

export default StaticErrorCheck;

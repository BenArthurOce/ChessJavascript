import { Square, SquareFactory, SquareHTML } from './Square.js';

import {
    Piece, Pawn, Rook, Knight, Bishop, Queen, King, HTMLPiece
} from "./Piece.js";

class ErrorCheck {

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
            ErrorCheck.handleError(`Supplied teamNum of ${teamNum} is invalid.`);
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
            ErrorCheck.handleError(`Supplied castlingName of ${castlingName} is invalid.`);
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
            ErrorCheck.handleError('Invalid input format for position.');
        }

        const [file, rank] = position;
        const validFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const validRanks = ['1', '2', '3', '4', '5', '6', '7', '8'];

        if (!validFiles.includes(file) || !validRanks.includes(rank)) {
            ErrorCheck.handleError('Invalid chess position.');
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
            ErrorCheck.handleError('Invalid chess position in array.');
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
            ErrorCheck.handleError('Invalid Square object or does not contain a valid chess piece.');
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
            ErrorCheck.handleError(`Contents of square ${squareObj.positionRef} are not an instance of ${whatClass.name}`);
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
            ErrorCheck.handleError('Invalid chess piece object.');
        }
    };
};

export default ErrorCheck;

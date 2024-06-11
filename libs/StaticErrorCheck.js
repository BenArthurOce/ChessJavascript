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
     * Checks if the Game object has a PGN to send to the Parser.
     *
     * @param {string} pgn The PGN string
     * @throws {Error} If the PGN string is null or undefined
     */
    static validatePGNExistence(pgn) {
        if (!pgn) {
            throw new Error(`[StaticErrorCheck] Parser did not receive a PGN. Code stopped`);
        }
    };


    /**
     * Checks if the Board object exists
     *
     * @param {string} board The Board object
     * @throws {Error} If the Board object is null or undefined
     */
    static validateBoardExistence(board) {
        if (!board) {
            throw new Error(`[StaticErrorCheck] the board object is null. Code stopped`);
        }
    };


    /**
     * Checks if the Parser object exists
     *
     * @param {string} parser The Parser object
     * @throws {Error} If the Parser object is null or undefined
     */
    static validateParserExistence(parser) {
        if (!parser) {
            throw new Error(`[StaticErrorCheck] the Parser object is null. Code stopped`);
        };
    };


    /**
     * Checks if the Game object's Board object has populated pieces 
     *
     * @param {Object} game The Game object
     * @throws {Error} If the Game.Board.grid object is empty or not an array
     */
    static checkIfBoardIsPopulated(game) {
        if (!game || !game.board || !Array.isArray(game.board.grid) || game.board.grid.length === 0) {
            throw new Error(`[StaticErrorCheck] Game.board.grid is empty or not properly populated. Code stopped`);
        };
    };


    /**
     * Checks if the "openings" object has all the required keys.
     *
     * @param {Object} openings The object to validate
     * @throws {Error} If any required key is missing or if the object is null/undefined
     */
    static validateOpeningObject(openings) {
        const requiredKeys = [
            'ID', 'FEN', 'ECO', 'VOLUME', 'NAME', 'PGN', 'MOVESSTRING', 
            , 'NUMMOVES', 'NEXTTOMOVE', 'FAMILY'
        ];
        
        if (!openings || typeof openings !== 'object') {
            throw new Error("[StaticErrorCheck] The provided openings object is not a valid object.");
        }

        requiredKeys.forEach(key => {
            if (!openings.hasOwnProperty(key)) {
                throw new Error(`[StaticErrorCheck] Missing required key: ${key}`);
            }
        });
    };



    /**
     * Checks if team number is correct (Must be a 0 or a 1).
     *
     * @param {number} teamNum The team number. White = 0, Black = 1
     * @throws {Error} If the team number passed does not equal a 0 or a 1
     */
    static validateTeamNumber(teamNum) {
        if (!teamNum === 0 && !teamNum === 1) {
            StaticErrorCheck.handleError(`[StaticErrorCheck] Supplied teamNum of ${teamNum} is invalid.`);
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
            StaticErrorCheck.handleError(`[StaticErrorCheck] Supplied castlingName of ${castlingName} is invalid.`);
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
            StaticErrorCheck.handleError('[StaticErrorCheck] Invalid input format for position.');
        }

        const [file, rank] = position;
        const validFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const validRanks = ['1', '2', '3', '4', '5', '6', '7', '8'];

        if (!validFiles.includes(file) || !validRanks.includes(rank)) {
            StaticErrorCheck.handleError('[StaticErrorCheck] Invalid chess position.');
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
            StaticErrorCheck.handleError('[StaticErrorCheck] Invalid chess position in array.');
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
            StaticErrorCheck.handleError('[StaticErrorCheck] Invalid Square object or does not contain a valid chess piece.');
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
            StaticErrorCheck.handleError(`[StaticErrorCheck] Contents of square ${squareObj.positionRef} are not an instance of ${whatClass.name}`);
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
            StaticErrorCheck.handleError('[StaticErrorCheck] Invalid chess piece object.');
        }
    };


    static validateMoveObject(moveObject) {
        if (typeof moveObject.teamNumber !== 'boolean') {
            throw new Error("[StaticErrorCheck] Invalid team number type. It must be a boolean value.");
        }
    
        if (!(moveObject.teamNumber === false || moveObject.teamNumber === true)) {
            throw new Error("[StaticErrorCheck] Invalid team number value. It must be either false or true.");
        }
    
        if (!(moveObject.notation.length > 0)) {
            throw new Error("[StaticErrorCheck] Invalid notation. It must have a length greater than 0.");
        }
    
        if (!(moveObject.turnNumber > 0)) {
            throw new Error("[StaticErrorCheck] Invalid turn number. It must be greater than 0.");
        }
    
        if (!(moveObject.pieceCode.length === 1)) {
            throw new Error("[StaticErrorCheck] Invalid piece code length. It must be exactly 1 character long.");
        }
    
        if (!(moveObject.targetPosX >= 0)) {
            throw new Error("[StaticErrorCheck] Invalid target position X. It must be greater than or equal to 0.");
        }
    
        if (!(moveObject.targetPosY >= 0)) {
            throw new Error("[StaticErrorCheck] Invalid target position Y. It must be greater than or equal to 0.");
        }
    
        if (!(moveObject.fullPieceCode.length === 2)) {
            throw new Error("[StaticErrorCheck] Invalid full piece code length. It must be exactly 2 characters long.");
        }
    
        if (!(moveObject.targetArray.length === 2)) {
            throw new Error("[StaticErrorCheck] Invalid target array length. It must contain exactly 2 elements.");
        }
    
        if (!(moveObject.targetSquare.length === 2)) {
            throw new Error("[StaticErrorCheck] Invalid target square length. It must be exactly 2 characters long.");
        }
    
        if (!(moveObject.Castling === "Kingside" || moveObject.Castling === "Queenside" || moveObject.Castling === false)) {
            throw new Error("[StaticErrorCheck] Invalid Castling value. It must be either 'Kingside', 'Queenside', or false.");
        }
    };
};

export default StaticErrorCheck;

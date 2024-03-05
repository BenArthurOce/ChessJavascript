import GameLogic from './StaticGameLogic.js';
import Parser from './StaticChessParser.js';
import Board from './Board.js';


/**
 * Represents a chess game.
 */
class Game {
    #parentElement;
    #className;
    #idNumber;
    #information;
    #notation
    #parser;
    #board;

    /**
     * Create a chess Game.
     * @param {Object} information - Information about the game sourced from StaticOpeningDatabase().
     * @param {number} idNumber - Unique ID number of the game.
     */
    constructor(information, idNumber) {
        /**
         * The parent element where the game is rendered.
         * @type {HTMLElement}
         * @private
         */
        this.#parentElement = document.body.querySelector("#side-board-containers");

        /**
         * The class name of the game.
         * @type {string}
         * @private
         */
        this.#className = "Game";

        /**
         * Unique ID number of the game.
         * @type {number}
         * @private
         */
        this.#idNumber = idNumber;

        /**
         * Information about the game.
         * Keys: CONTINUATION, CONTINUATIONNAME, ECO, ERROR, FAVOURITE, NAME, NUMMOVES, PARSER, PGN, VOLUME
         * @type {Object}
         * @private
         */
        this.#information = information;

        /**
         * Notation string of the chess game.
         * @type {string}
         * @private
         */
        this.#notation = information[`PGN`];

        /**
         * The parser for the game notation.
         * @type {Parser}
         * @private
         */
        this.#parser = new Parser(this.#notation);

        /**
         * The game board.
         * @type {Board}
         * @private
         */
        this.#board = new Board(this.#idNumber, this.#parentElement);
    };

    /**
     * Get the parent element.
     * @type {HTMLElement}
     * @returns {HTMLElement} The parent element.
     */
    get parentElement() {
        return this.#parentElement;
    };

    /**
     * Get the class name.
     * @type {string}
     * @returns {string} The class name.
     */
    get className() {
        return this.#className;
    };

    /**
     * Get the ID number.
     * @type {number}
     * @returns {number} The ID number.
     */
    get idNumber() {
        return this.#idNumber;
    };

    /**
     * Get the information about the game
     * Keys: CONTINUATION, CONTINUATIONNAME, ECO, ERROR, FAVOURITE, NAME, NUMMOVES, PARSER, PGN, VOLUME
     * @type {Object}.
     * @returns {Object} Information about the game.
     */
    get information() {
        return this.#information;
    };

    /**
     * Get the notation string of the game.
     * @type {string}
     * @returns {string} The notation string of the game.
     */
    get notation() {
        return this.#notation;
    };

    /**
     * Get the parser for the game notation.
     * @type {Parser}
     * @returns {Parser} The parser for the game notation.
     */
    get parser() {
        return this.#parser;
    };

    /**
     * Get the game board.
     * @type {Board}
     * @returns {Board} The game board.
     */
    get board() {
        return this.#board;
    };




    /**
     * initGame - WIP
     * 
     */
    initGame() {
        GameLogic.processAllMoves(this.board, this.parser)
        this.TransferGameToDOM()
    };
    

    /**
     * TransferGameToDOM - WIP
     * 
     */
    TransferGameToDOM() {

        // Define board as flat array
        const boardFlat = this.board.grid.flat()

        // Read through the chessboard, read through its Square() objects and if it has a Piece() object. Update the Square() and the Dom
        for (let i = 0; i < boardFlat.length && i < boardFlat.length; i++) {
            const squareObj = boardFlat[i];
            if (squareObj.contents === null) {
                // Nothing happens. Skip to next square
            } else {
                squareObj.setPiece(squareObj.contents)
            }
        }
    };


    /**
     * resetGame - WIP
     * Doesnt seem to be used anywhere at the moment
     */
    resetGame() {
        // Define both boards as flat arrays
        const boardFlat = this.board.grid.flat()
        for (let i = 0; i < boardFlat.length && i < stateHTML.length; i++) {
            const squareObj = boardFlat[i];
            squareObj.removePiece()            
        }
    };
};

export default Game
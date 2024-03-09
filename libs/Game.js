import StaticGameLogic from './StaticGameLogic.js';
import StaticParser from './StaticChessParser.js';
import Board from './Board.js';


/**
 * Represents a chess game.
 */
class Game {
    #parentElement;
    #element
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
    constructor(information, idNumber, parentElement) {


        /**
         * The parent element where the game is rendered.
         * @type {HTMLElement}
         * @private
         */
        this.#parentElement = parentElement
        // this.#parentElement = document.body.querySelector("#side-board-containers");


        /**
         * The element of the Game() class.
         * @type {HTMLElement}
         * @private
         */
        this.#element = null;


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
        // this.#notation = information[`PGN`];
        this.#notation = (information===null) ? null : information[`PGN`]

        /**
         * The parser for the game notation.
         * @type {StaticParser}
         * @private
         */
        this.#parser = (information===null) ? null : new StaticParser(this.information[`PGN`]);

        /**
         * The game board.
         * @type {Board}
         * @private
         */

        this.createElement()
        this.#board = new Board(this.#idNumber, this.element);


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
     * Get the element.
     * @type {HTMLElement}
     * @returns {HTMLElement} The element.
     */
    get element() {
        return this.#element;
    };

    /**
     * Set the element.
     */
    set element(value) {
        this.#element = value;
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
     * @type {StaticParser}
     * @returns {StaticParser} The parser for the game notation.
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
    createElement() {
        if (!this.parentElement) {return}
        this.element = document.createElement('div');
        this.element.className = `chessboard-container`;
        this.element.id = `chessboard-container${this.idNumber}`;
        this.parentElement.appendChild(this.element);

        // console.log(this.information.NAME)
        // console.log(this.information)

        if (!this.information) return

        // Notation of the opening
        const notationEl = document.createElement('p');
        const notationTxt = document.createTextNode(`${this.information.PGN}`);
        notationEl.appendChild(notationTxt);
        this.element.appendChild(notationEl);

        // Name of the opening
        const textEl = document.createElement('p');
        const text = document.createTextNode(`${this.information.NAME}`);
        textEl.appendChild(text);
        this.element.appendChild(textEl);

        // ECO
        const ecoEl = document.createElement('p');
        const eco = document.createTextNode(`${this.information.ECO}`);
        ecoEl.appendChild(eco);
        this.element.appendChild(ecoEl);

        // Delete button
        const buttonEl = document.createElement('button');
        buttonEl.textContent = "delete"
        // this.element.appendChild(buttonEl);


        // Button click event
        buttonEl.addEventListener('click', () => {
            // this.renderBoardsToPage()
            this.resetGame()
        });

    }


    /**
     * initGame - WIP
     * 
     */
    initGame() {
        StaticGameLogic.processAllMoves(this.board, this.parser)
        this.TransferGameToDOM()
        // document.querySelector(`#chessboard-container${this.idNumber}`).addEventListener('click', this.handleBoardClick.bind(this));
    };

    handleBoardClick(event) {
        console.log(this.information.NAME)
    }
    

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
     */
    resetGame() {
        // Currently triggered from the "Delete button" in the Game() object
        // Clears all squares of pieces
        
        // Define board as flat array
        const boardFlat = this.board.grid.flat()

        for (let i = 0; i < boardFlat.length && i < boardFlat.length; i++) {
            const squareObj = boardFlat[i];
            squareObj.clearContents()            
        }
    };
};


// This is a class designed to disregard all elements / parent elements and just run without a display. printToTerminal will display the board
class GameTest extends Game {
    constructor(information) {
        super(information);    
    };

    initTestGame() {
        StaticGameLogic.processAllMoves(this.board, this.parser)
    };

    getBoardObject() {
        return this.board;
    }
};

export {Game, GameTest};

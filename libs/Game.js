import GameLogic from './StaticGameLogic.js';
import Parser from './StaticChessParser.js';
import {Board, BoardFactory, BoardHTML} from './Board.js';
import { HTMLPiece } from './Piece.js';


class Game {
    #parser;
    #boardState;
    #boardHTML;
    #notation

    constructor(notation) {
        this.#notation = notation
    };
    get parser() {
        return this.#parser;
    };
    set parser(value) {
        this.#parser = value;
    };
    get boardState() {
        return this.#boardState;
    };
    set boardState(value) {
        this.#boardState = value;
    };
    get boardHTML() {
        return this.#boardHTML;
    };
    set boardHTML(value) {
        this.#boardHTML = value;
    };
    get notation() {
        return this.#notation;
    };

    // Need Method that transfers the game state from factory to DOM

    initGame() {

        // Establish a new board
        this.boardState = new BoardFactory;

        this.parser = new Parser(this.notation)

        GameLogic.processAllMoves(this.boardState, this.parser)

        const parentElement = document.body.querySelector("#side-board-containers")
        this.boardHTML = new BoardHTML(parentElement)

        this.TransferGameToDOM()

        // this.resetGame()

    };

    TransferGameToDOM() {



        // Define both boards as flat arrays
        const stateFactory = this.boardState.grid.flat()
        const stateHTML = this.boardHTML.grid.flat()

        // Read through the factory chessboard, clone its pieces to the HTML chessboard
        for (let i = 0; i < stateFactory.length && i < stateHTML.length; i++) {
            const squareFactory = stateFactory[i];
            const squareHTML = stateHTML[i];

            if (squareFactory.contents === null) {
                // squareHTML.setPiece(new HTMLPiece("-"))
                squareHTML.setPiece(null)
            } else {
                squareHTML.setPiece(new HTMLPiece(squareFactory.contents.code))
            }
        }
    };

    // clearBoard() {

    // }

    resetGame() {
        // Define both boards as flat arrays
        const stateFactory = this.boardState.grid.flat()
        const stateHTML = this.boardHTML.grid.flat()
        for (let i = 0; i < stateFactory.length && i < stateHTML.length; i++) {
            const squareFactory = stateFactory[i];
            const squareHTML = stateHTML[i];
            squareFactory.removePiece()
            squareHTML.removePiece()
            
        }
    }
};

export default Game
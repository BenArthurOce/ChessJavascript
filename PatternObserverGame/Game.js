
// import StaticGameLogic from './StaticGameLogic.js';
// import StaticParser from './StaticChessParser.js';
// import StaticChessUtility from './StaticChessUtility.js';
// import  { Board, BoardDisplay, BoardInteractive} from './BoardUsingFEN.js';
// import StaticErrorCheck from './StaticErrorCheck.js';

import StaticChessUtility from '../libs/StaticChessUtility.js';
import StaticErrorCheck from '../libs/StaticErrorCheck.js';
import { Board, BoardDisplay, BoardInteractive} from '../libs/BoardUsingFEN.js';

/* 
The Game() class is what holds the information about the chessgame, which has been generated from the Dictionary() object
Game() contains the Board() object, which contains all the Square() and Piece Object()
*/


//
class Game {
    #parentElement;     // Object that contains this object, in this case, its FrontPage() if specified, or defaults to a div element
    #element;           // This DOM element
    #className;         // Name of this class
    #classSubName;      // Name of this subclass
    #idNumber;          // Id number of the game. Is passed on to the Board() and the DOM
    #information;       // Data object obtained from Dictionary().
    #displayFields;     // Dictionary fields that are displayed with the board


    constructor(information, idNumber) {
        // console.log(`\tFunc: START constructor (Game)`);

        StaticErrorCheck.validateOpeningObject(information)
        this.#parentElement = document.createElement('div');
        this.#idNumber = idNumber;
        this.#information = information;
        this.#className = "Game"
        this.#classSubName = "";
        this.#element = document.createElement('div');

        this.#displayFields = ['ID', 'FEN', 'NAME', 'FAMILY', 'VARIATION', 'SUBVARIATION', 'NUMTURNS', 'PGN', 'CONTINUATIONSNEXT']
        // this.addInfoToElement(this.#displayFields) // Takes game information, and displays them to user with the chessboard

        // console.log(`\tFunc: END constructor (Game)`);
    };
    get parentElement() {
        return this.#parentElement;
    };
    set parentElement(value) {
        this.#parentElement = value;
    };
    get element() {
        return this.#element;
    };
    set element(value) {
        this.#element = value;
    };
    get className() {
        return this.#className;
    };
    get classSubName() {
        return this.#classSubName;
    };
    get idNumber() {
        return this.#idNumber;
    };
    get gameInformation() {
        return this.#information;
    };
    set gameInformation(value) {
        this.#information = value;
    };

    setParentElement(parentElement) {
        this.#parentElement = parentElement ? parentElement : document.createElement('div');
    };

    createElement(type) {
        this.element.className = `chessboard-container ${type}`;    // type is either small or large
        this.element.id = `chessboard${this.idNumber}`; 
    };

    createChessBoard(fen) {
        this.board = new BoardDisplay(0, this.element, fen);
        this.addInfoToElement() // Displays information under the chessboard
    };

    returnChessboard() {
        return this.board;
    };

    updateGameInformation(info) {
        this.gameInformation = info
    };

    returnFEN() {
        return this.board.constructFEN()
    };

    render() {
        this.#parentElement.appendChild(this.element)
    };

    print() {
        this.returnChessboard().printToTerminal()
    };

    addInfoToElement() {
        const displayNameFn = (name) => StaticChessUtility.displayWordFromJSON(name);

        this.#displayFields.forEach((field, index) => {
            const displayName = displayNameFn(field);
            const infoEl = document.createElement('p');
            infoEl.classList.add(field.toLowerCase());

            const boldEl = document.createElement('strong');
            boldEl.appendChild(document.createTextNode(displayName || field));

            infoEl.appendChild(boldEl);
            infoEl.appendChild(document.createTextNode(' '));

            const infoTxt = document.createTextNode(this.gameInformation[field] || '');
            infoEl.appendChild(infoTxt);

            this.element.appendChild(infoEl);
        });
    };

    createChessBoardFORTESTING() {
        // this.board = new Board(0, this.element);
        this.board = new BoardDisplay(0, this.element);
    };
};








class GameSmall extends Game {
    constructor(information, idNumber, parentElement, fen) {
        super(information, idNumber, parentElement);
        this.setParentElement(parentElement);
        this.createElement("small");
        this.createChessBoard(fen);
    }

    update(fen) {
        this.refreshChessBoard(fen);
    }

    refreshChessBoard(fen) {
        this.board = null;
        this.board = new BoardInteractive(0, this.element, fen);
        this.addInfoToElement();
    }
}




class GameLarge extends Game {
    #storedFEN;

    constructor(opening, idNumber, parentElement, callback) {
        super(opening, idNumber, parentElement);
        this.callback = callback;
        this.setParentElement(parentElement);
        this.createElement("large");
        this.createChessBoard(opening);
        this.initLocalEventListeners();
        this.observers = [];

        this.turnNumber = opening["NUMTURNS"];
        this.turnTeamNumber = opening["NUMMOVES"] % 2;
        this.clickInstance = 0;
        this.firstSquareClicked = null;
        this.secondSquareClicked = null;
    }

    get storedFEN() {
        return this.#storedFEN;
    }

    set storedFEN(value) {
        this.#storedFEN = value;
        this.callback(this.#storedFEN);
        this.notify(this.#storedFEN);
    }

    // Other methods remain the same...

    // This handles the large Chessboard, and clicking on squares to move pieces
    initLocalEventListeners() {  
        // Prepare all Square() objects as a single array
        const allSquares = this.board.grid.flat();
    
        // Function to toggle between click instances and team numbers on turns
        const toggleClickInstance = () => this.clickInstance ^= 1;
        const toggleTeamNumber = () => this.turnTeamNumber ^= 1;
    
        // Functions to check the state of click instances. Two Clicks = One Move
        const isFirstClickInstance = () => this.clickInstance === 0;
        const isSecondClickInstance = () => this.clickInstance === 1;
    
        // Functions to check square conditions
        const isClickedSquareEmpty = (squareObj) => !squareObj.contents;
        const isClickedSquareHavePiece = (squareObj) => !!squareObj.contents;
        const isFirstClickASquare = (squareObj) => squareObj.contents && this.clickInstance === 0;
        const isSecondClickASquare = (squareObj) => squareObj.contents && this.clickInstance === 1;
        const isFirstClickLegal = (squareObj) => this.clickInstance === 0 && squareObj.contents;
        const isWhiteMoveClick = (squareObj) => squareObj.contents && squareObj.contents.team === 0 && this.turnTeamNumber === 0;
        const isBlackMoveClick = (squareObj) => squareObj.contents && squareObj.contents.team === 1 && this.turnTeamNumber === 1;
        const isSameTeam = (squareObj) => squareObj.contents && squareObj.contents.team === this.firstSquareClicked?.contents.team;
        const isSameSquare = (squareObj) => squareObj.contents && squareObj === this.firstSquareClicked;
    
        allSquares.forEach(square => {
            square.element.addEventListener('click', () => {
    
                // Handling the first click instance
                if (isFirstClickInstance() && isClickedSquareEmpty(square)) return;

                // If it's a valid move for the current team, toggle the square activation
                if (isFirstClickInstance() && (isWhiteMoveClick(square) || isBlackMoveClick(square))) {
                    square.toggleActivated();
                    this.firstSquareClicked = square;
                    toggleClickInstance();
                    return;
                };

                // Handling the second click instance
                if (isSecondClickInstance()) {

                    // If the same square is clicked again, deactivate it and reset
                    if (isSameSquare(square)) {
                        this.firstSquareClicked.toggleActivated();
                        this.firstSquareClicked = null;
                        toggleClickInstance();
                        return;
                    };

                    // If clicking on a square of the same team, do nothing and exit
                    if (isSameTeam(square)) {
                        return;
                    };

                    // Otherwise, toggle and store the second square clicked. Do nothing beyond that.
                    square.toggleActivated();
                    this.secondSquareClicked = square;
                    toggleClickInstance();
                };

                // If both squares have been selected. Perform the move
                if (this.firstSquareClicked && this.secondSquareClicked) {

                    // Record the Move
                    // this.#logMovement();

                    // Move the piece
                    this.board.movePiece(this.firstSquareClicked.contents, this.secondSquareClicked.positionRef);

                    // Update FEN
                    const boardState = this.returnFEN();
                    this.storedFEN = boardState;

                    // Toggle the next player to move
                    toggleTeamNumber();

                    // Remove activations and reset clicked squares
                    this.firstSquareClicked.toggleActivated();
                    this.secondSquareClicked.toggleActivated();
                    this.firstSquareClicked = null;
                    this.secondSquareClicked = null;
                };
            }); // End AddEventListener
        });
    };

    // Attach, detach, and notify methods
    attach(observer) {
        this.observers.push(observer);
    }

    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(fen) {
        this.observers.forEach(observer => observer.update(fen));
    }
}

export {Game, GameLarge, GameSmall}
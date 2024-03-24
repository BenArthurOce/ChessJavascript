import StaticGameLogic from './StaticGameLogic.js';
import StaticParser from './StaticChessParser.js';
import StaticChessUtility from './StaticChessUtility.js';
import  { Board, BoardDisplay, BoardInteractive} from './Board.js';


class Game {
    #parentElement;     // Object that contains this object, in this case, its FrontPage() if specified, or defaults to a div element
    #element;           // This DOM element
    #className;         // Name of this class
    #classSubName;      // Name of this subclass
    #idNumber;          // Id number of the game. Is passed on to the Board() and the DOM
    #information;       // Data object obtained from Dictionary().
    #parser;            // Parser() object that lists the details of each move in that opening
    #board;             // Board() object that exists in the Game() class

    constructor(information, idNumber) {
        // console.log(`\tFunc: START constructor (Game)`);
        this.#parentElement = document.createElement('div');
        this.#idNumber = idNumber;
        this.#information = information;
        this.#className = "Game"
        this.#classSubName = "";
        this.#board = null;
        // this.#element = this.createContainer();
        this.#element = document.createElement('div');
        this.#parser = null;
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
    get parser() {
        return this.#parser;
    };
    set parser(value) {
        this.#parser = new StaticParser(value)
    };
    get board() {
        return this.#board;
    };
    set board(value) {
        this.#board = value;
    };

    setParentElement(parentElement) {
        this.#parentElement = parentElement ? parentElement : document.createElement('div');
    };

    returnChessboard() {
        return this.board;
    };

    updateGameInformation(info) {
        this.gameInformation = info
        this.parser = info.PGN
    };

    setParser() {
        this.#parser = new StaticParser(this.gameInformation.PGN)
    };

    createElement(type) {
        //type is either small or large
        this.element.className = `chessboard-container ${type}`;
        this.element.id = `chessboard${this.idNumber}`;
    };

    runGameWithParserObject() {
        StaticGameLogic.processAllMoves(this.board, this.parser);
    }

    render() {
        this.#parentElement.appendChild(this.element)
    };

    print() {
        this.returnChessboard().printToTerminal()
    };


    addInfoToElement(fieldList) {
        const displayNameFn = (name) => StaticChessUtility.displayWordFromJSON(name);

        fieldList.forEach((field, index) => {
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
};


// DisplayGame class handles rendering and user interactions
class GameLarge extends Game {
    #storedPGN
    constructor(information, idNumber, parentElement, callback) {
        console.log(`\tFunc: START constructor (GameLarge)`);
        super(information, idNumber, parentElement);
        this.callback = callback
        this.setParentElement(parentElement); // If parentElement is null, we create a div
        this.createElement("large"); // Create the element. This is the container for the chessboard
        this.createChessBoard(); // Creates and populates the Board() object
        this.initLocalEventListeners(); // Adds events to the Square() objects inside the Board()

        // information is null in the main display board
        // const fields = ['PGN', 'NAME', 'ECO', 'NEXTTOMOVE', 'FAMILY', 'VARIATION', 'SUBVARIATION', 'NUMMOVES']
        // this.addInfoToElement(fields);              // Takes game information, and displays them to user with the chessboard


        // The following attributes are used in the event listener
        this.turnNumber = 1;
        this.turnTeamNumber = 0
        this.#storedPGN = ""

        this.clickInstance = 0
        this.firstSquareClicked = null;
        this.secondSquareClicked = null;

        this.onStoredPGNChangeCallbacks = []; // Array to store callback functions

        console.log(`\tFunc: END constructor (GameLarge)`);
    };
    get storedPGN() {
        return this.#storedPGN;
    };
    set storedPGN(value) {
        this.#storedPGN = value;
        this.callback(this.#storedPGN)
    };


    createChessBoard() {
        this.board = new BoardInteractive(0, this.element);
    };


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
                    this.#logMovement();

                    // Move the piece
                    this.board.movePiece(this.firstSquareClicked.contents, this.secondSquareClicked.positionRef);

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
    

    #logMovement() {
        const isCapture = () => (this.firstSquareClicked.contents && this.secondSquareClicked.contents) ? true : false;
        const isPawnCapture = () => (isCapture() && this.firstSquareClicked.contents.pieceCodeStr === "p") ? true : false;
        const getDestination = () => this.secondSquareClicked.positionRef;
        const getPawnFileCapture = () => isPawnCapture() ? this.firstSquareClicked.fileRef : null;
        const getPieceCode = () => (this.firstSquareClicked.contents.pieceCodeStr === "p") ? "" : this.firstSquareClicked.contents.pieceCodeStr


        function createString() {
            // There was a capture, it was not a pawn capture
            if (isCapture() && !isPawnCapture()) {
                return getPieceCode() + "x" + getDestination();
            };

            // If there was a pawn capture
            if (isCapture() && isPawnCapture()) {
                return getPawnFileCapture() + getPieceCode() + "x" + getDestination();
            };

            // If no capture
            return getPieceCode() + getDestination();
        };


        // Create the move notation and add an empty space at the end
        let createdString = createString() + " ";

        // If its white move, add the turn number
        if (this.turnTeamNumber === 0) {
            this.storedPGN += `${this.turnNumber}.${createdString}`
            this.turnNumber++
        } else {
            this.storedPGN += createdString;
        }

    };
};



class GameSmall extends Game {
    constructor(information, idNumber, parentElement) {
        // console.log(`\tFunc: START constructor (GameSmall)`);

        super(information, idNumber, parentElement);
        this.setParentElement(parentElement)            // If parentElement is null, we create a div
        this.createElement("small")                     // Create the element. This is the container for the chessboard
        this.createChessBoard()                         // Creates and populates the Board() object

        const fields = ['NAME', 'FAMILY', 'VARIATION', 'SUBVARIATION', 'NUMMOVES', 'PGN']
        this.addInfoToElement(fields) // Takes game information, and displays them to user with the chessboard

        // console.log(`\tFunc: END constructor (GameSmall)`);
    };


    createChessBoard() {
        this.board = new BoardDisplay(0, this.element);
    };
};


export {Game, GameLarge, GameSmall};
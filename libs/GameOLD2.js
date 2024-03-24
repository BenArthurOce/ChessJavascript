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
    constructor(information, idNumber, parentElement) {
        console.log(`\tFunc: START constructor (GameLarge)`);
        super(information, idNumber, parentElement);
        this.setParentElement(parentElement); // If parentElement is null, we create a div
        this.createElement("large"); // Create the element. This is the container for the chessboard
        this.createChessBoard(); // Creates and populates the Board() object
        this.initLocalEventListeners(); // Adds events to the Square() objects inside the Board()

        // information is null in the main display board
        // const fields = ['PGN', 'NAME', 'ECO', 'NEXTTOMOVE', 'FAMILY', 'VARIATION', 'SUBVARIATION', 'NUMMOVES']
        // this.addInfoToElement(fields);              // Takes game information, and displays them to user with the chessboard

        this.turnNumber = 1;
        this.turnTeamNumber = 0
        this.storedPGN = ""

        this.onStoredPGNChangeCallbacks = []; // Array to store callback functions

        console.log(`\tFunc: END constructor (GameLarge)`);
    };

    createChessBoard() {
        this.board = new BoardInteractive(0, this.element);
    };


    // Add a method to register callback functions
    registerOnStoredPGNChangeCallback(callback) {
        this.onStoredPGNChangeCallbacks.push(callback);
    };


    // Method to notify all registered callbacks when storedPGN changes
    notifyStoredPGNChange() {
        for (const callback of this.onStoredPGNChangeCallbacks) {
            callback(this.storedPGN);
        }
    };


    initLocalEventListeners() {
        console.log(`\t\t\tFunc: START initLocalEventListeners (BoardInteractive)`);

        const allSquares = this.board.grid.flat()

        allSquares.forEach(square => {

            square.element.addEventListener('click', () => {

                // const isWhiteMoveClick = (squareObj) => squareObj.contents.team === 0 && this.turnTeamNumber === 0
                // const isBlackMoveClick = (squareObj) => squareObj.contents.team === 1 && this.turnTeamNumber === 1

                const isWhiteMoveClick = (squareObj) => squareObj.contents && squareObj.contents.team === 0 && this.turnTeamNumber === 0;
                const isBlackMoveClick = (squareObj) => squareObj.contents && squareObj.contents.team === 1 && this.turnTeamNumber === 1;
         
                const isFirstClickValid = (squareObj) => squareObj.contents && squareObj.contents.team === this.turnTeamNumber;
                const isSecondClickValid = (squareObj) => !squareObj.contents || squareObj.contents.team !== this.turnTeamNumber;
                const isSameSquare = (squareObj) => this.firstSquareClicked === squareObj;
                


                const activateSecondSquare = () => { this.secondSquareClicked = square; this.secondSquareClicked.toggleActivated(); };
                const logMovementAndSwitchTurn = () => { this.#logMovement(); this.turnTeamNumber = (this.turnTeamNumber === 0) ? 1 : 0; };
                const movePieceAndUpdateBoard = () => { this.board.movePiece(this.firstSquareClicked.contents, this.secondSquareClicked.positionRef); };
                const resetClickedSquaresAndLogPGN = () => { this.firstSquareClicked.toggleActivated(); this.secondSquareClicked.toggleActivated(); this.firstSquareClicked = null; this.secondSquareClicked = null; console.log(this.storedPGN); };
                
                activateSecondSquare();
                logMovementAndSwitchTurn();
                movePieceAndUpdateBoard();
                resetClickedSquaresAndLogPGN();


                console.log("=============")
                console.log("=============")
                console.log(isWhiteMoveClick(square))
                console.log(isBlackMoveClick(square))
                console.log("=============")

                console.log(isFirstClickValid(square))
                console.log(isSecondClickValid(square))
                console.log(isSameSquare(square))
                console.log("=============")
                console.log("=============")


                    this.secondSquareClicked = square; this.secondSquareClicked.toggleActivated(); this.#logMovement(); this.turnTeamNumber = (this.turnTeamNumber === 0) ? 1 : 0; this.board.movePiece(this.firstSquareClicked.contents, this.secondSquareClicked.positionRef); this.firstSquareClicked.toggleActivated(); this.secondSquareClicked.toggleActivated(); this.firstSquareClicked = null; this.secondSquareClicked = null; console.log(this.storedPGN);


                //
                // First Mouse Click
                //
                // Check if the square is allowed. Only white or black depending on move
                if (square.contents) {
                    const isWhiteMoveClick = (squareObj) => squareObj.contents.team === 0 && this.turnTeamNumber === 0
                    const isBlackMoveClick = (squareObj) => squareObj.contents.team === 1 && this.turnTeamNumber === 1

                    // If both are false, exit the function.
                    if (!isWhiteMoveClick(square) && !isBlackMoveClick(square)) return
                };

                // const isSameSquare = (squareObj) => this.firstSquareClicked squareObj === [DOES NOT WORK]
                // If the square clicked is the same as the first square, then reset the squares and end the function
                if (this.firstSquareClicked === square) {

                    this.firstSquareClicked.toggleActivated()
                    this.firstSquareClicked = null
                    this.secondSquareClicked = null
                    return
                }

                // If the first active square is null - then we populate it
                if (!this.firstSquareClicked) {

                    // However, if a non piece square was clicked, we exit
                    if (!square.contents) {
                        return
                    }
                    this.firstSquareClicked = square
                    this.firstSquareClicked.toggleActivated()

                    // console.log(this.firstSquareClicked.contents.team)
                }

                // If a Square() is already "activated", and we pick a second Square()
                // Then move the piece, and store the results
                else {
                    // If a Square() is already "activated", and we pick a second Square()
                    // Then move the piece, and store the results
                    this.secondSquareClicked = square;
                    this.secondSquareClicked.toggleActivated();
                    // this.moveHistory.push({ piece: this.firstSquareClicked.contents, destination: this.secondSquareClicked.positionRef });
                    this.#logMovement();

                    // Swap between if white or black move
                    // we need this to determine where to put in the "1." part of the PGN
                    this.turnTeamNumber = (this.turnTeamNumber === 0) ? 1 : 0;

                    this.board.movePiece(this.firstSquareClicked.contents, this.secondSquareClicked.positionRef);

                    // restart
                    this.firstSquareClicked.toggleActivated();
                    this.secondSquareClicked.toggleActivated();
                    this.firstSquareClicked = null;
                    this.secondSquareClicked = null;
                    console.log(this.storedPGN)


                }

            })

        });

        console.log(`\t\t\tFunc: END initLocalEventListeners (BoardInteractive)`);

    };

    #logMovement() {
        // Determine the text that gets updated
        // const pgnTextBox = document.querySelector("#pgnInput")

        // Is there a capture?
        let isCapture = false
        let isPawnCapture = false
        if (this.firstSquareClicked.contents && this.secondSquareClicked.contents) {
            isCapture = true
        }

        // If it was a pawn capture
        if (isCapture && this.firstSquareClicked.contents.pieceCodeStr === "p") {
            isPawnCapture = true
        }


        // Piece that was moved
        let pieceCode = this.firstSquareClicked.contents.pieceCodeStr
        if (pieceCode === "p") {
            pieceCode = ""
        }


        // Destination Square
        let destination = this.secondSquareClicked.positionRef

        // Pawn Capture file (if pawn capture)
        let pawnFileCapture = this.firstSquareClicked.fileRef


        //
        //  Final result
        //
        let finalResult


        // if there was no capture
        if (!isCapture) {
            finalResult = pieceCode + destination + " ";
        }
        // If there was a capture (no pawn)
        else if (isCapture && !isPawnCapture) {
            finalResult = pieceCode + "x" + destination + " ";
        } else if (isCapture && isPawnCapture) {
            finalResult = pawnFileCapture + "x" + destination + " ";
        }

        // If its white move, add the turn number
        if (this.turnTeamNumber === 0) {
            this.storedPGN += `${this.turnNumber}.`
            this.turnNumber++
        }


        this.storedPGN += finalResult
        // After updating storedPGN, notify the callbacks
        this.notifyStoredPGNChange();
    }

};



class GameSmall extends Game {
    constructor(information, idNumber, parentElement) {
        // console.log(`\tFunc: START constructor (GameSmall)`);

        super(information, idNumber, parentElement);
        this.setParentElement(parentElement) // If parentElement is null, we create a div
        this.createElement("small") // Create the element. This is the container for the chessboard
        this.createChessBoard() // Creates and populates the Board() object

        const fields = ['NAME', 'FAMILY', 'VARIATION', 'SUBVARIATION', 'NUMMOVES', 'PGN']
        this.addInfoToElement(fields) // Takes game information, and displays them to user with the chessboard

        // console.log(`\tFunc: END constructor (GameSmall)`);
    };


    createChessBoard() {
        this.board = new BoardDisplay(0, this.element);
    };
};


export {Game, GameLarge, GameSmall};
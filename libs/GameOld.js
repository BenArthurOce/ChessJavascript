import StaticGameLogic from './StaticGameLogic.js';
import StaticParser from './StaticChessParser.js';
import  { Board, BoardTest, BoardInteractive } from './Board.js';

class Game {
    #parentElement;
    #element;
    #className;
    #idNumber;
    #information;
    #parser;
    #board;
    constructor(information, idNumber, parentElement) {
        // console.log(`\tFunc: START constructor (Game)`);
        this.#parentElement = parentElement;
        this.#element = document.createElement('div');
        this.#idNumber = idNumber;
        this.#information = information;
        this.#parser = null;
        this.#board = null;

        if (information) {
            this.#information = information;
            this.#parser = new StaticParser(information.PGN)
        }
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
    get idNumber() {
        return this.#idNumber;
    };
    get information() {
        return this.#information;
    };
    get parser() {
        return this.#parser;
    };
    get board() {
        return this.#board;
    };
    set board(value) {
        this.#board = value;
    };

    init() {
        // console.log(`\tFunc: START init (Game)`);
        this.#board = new Board(this.#idNumber, this.createGameElement());
        this.#board.init()
  
        if (this.#information) {
            this.#addInfoToElement();
            StaticGameLogic.processAllMoves(this.#board, this.#parser);
        }
        // console.log(`\tFunc: START init (Game)`);
    };

    createGameElement() {
        const chessboardContainer = document.createElement('div');
        chessboardContainer.className = 'chessboard-container';
        chessboardContainer.id = `chessboard-container${this.#idNumber}`;
        this.#parentElement.appendChild(chessboardContainer);
        this.#element = chessboardContainer;
        return chessboardContainer;
    };


    #addInfoToElement() {
        const infoFields = ['PGN', 'NAME', 'ECO', 'NEXTTOMOVE', 'FAMILY', 'VARIATION', 'SUBVARIATION', 'NUMMOVES'];
        const labels = ['PGN:', 'NAME:', 'ECO:', 'NEXT:', 'FAMILY:', 'VARIATION:', 'SUB VARIATION:', 'NUMMOVES']; // Bold text labels
        infoFields.forEach((field, index) => {
            const infoEl = document.createElement('p');
            infoEl.classList.add(infoFields[index].toLowerCase())
            // Create a bold element for the label
            const boldEl = document.createElement('strong');
            const boldTxt = document.createTextNode(labels[index]);
            boldEl.appendChild(boldTxt);
            infoEl.appendChild(boldEl);
            // Add a space between the label and the information
            infoEl.appendChild(document.createTextNode(' '));
            // Append the information text
            const infoTxt = document.createTextNode(this.#information[field]);
            infoEl.appendChild(infoTxt);
            this.#element.appendChild(infoEl);
        });
    };
};


// This is a class designed to disregard all elements / parent elements and just run without a display. printToTerminal will display the board
class GameTest extends Game {
    // #board
    constructor(information) {
        console.log(`\t----Func: START constructor (GameTest)`);
        console.log(information)
        super(information);
        // this.#board = null
        console.log(`\t----Func: END constructor (GameTest)`);
    };

    init() {
        this.board = new BoardTest(0, this.createGameElement());
        this.board.init()
    };

    initTestGame() {
        StaticGameLogic.processAllMoves(this.board, this.parser)
    };

    createGameElement() {
        this.element = document.createElement('div');
        return document.createElement('div')
    };
};


// This is a class that contains an interactive game board
class GameInteractive extends Game {
    #board;
    
    constructor(information, idNumber, parentElement) {
        // console.log(`\t----Func: START constructor (GameInteractive)`);
        super(information, idNumber, parentElement);
        this.parentElement = parentElement
        this.#board = null
        this.firstSquareClicked = null;
        this.secondSquareClicked = null;
        this.turnNumber = null;
        this.turnTeamNumber = null  // can only ever be 0 = white or 1 = black
        this.storedPGN = "";
        this.onStoredPGNChangeCallbacks = []; // Array to store callback functions
        
        // console.log(`\t----Func: END constructor (GameInteractive)`);
    };


    init() {
        console.log(`\t----Func: START init (GameInteractive)`);

        this.#board = new BoardInteractive(0, this.createGameElement());
        this.#board.init()
        this.turnNumber = 1;
        this.turnTeamNumber = 0
        this.storedPGN = ""
        this.moveHistory = []

        this.initLocalEventListeners()
        console.log(`\t----Func: END init (GameInteractive)`);
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
        // console.log(`\t\t\tFunc: START initLocalEventListeners (BoardInteractive)`);

        const allSquares = this.#board.grid.flat()

        allSquares.forEach(square => {

            square.element.addEventListener('click', () => { 
                

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
                    if (!square.contents) {return}
                    this.firstSquareClicked = square
                    this.firstSquareClicked.toggleActivated()

                    console.log(this.firstSquareClicked.contents.team)
                }

                // If a Square() is already "activated", and we pick a second Square()
                // Then move the piece, and store the results
             else {
                // If a Square() is already "activated", and we pick a second Square()
                // Then move the piece, and store the results
                this.secondSquareClicked = square;
                this.secondSquareClicked.toggleActivated();
                this.moveHistory.push({ piece: this.firstSquareClicked.contents, destination: this.secondSquareClicked.positionRef });
                this.#logMovement();

                // Swap between if white or black move
                // we need this to determine where to put in the "1." part of the PGN
                this.turnTeamNumber = (this.turnTeamNumber === 0) ? 1 : 0;

                this.#board.movePiece(this.firstSquareClicked.contents, this.secondSquareClicked.positionRef);

                // restart
                this.firstSquareClicked.toggleActivated();
                this.secondSquareClicked.toggleActivated();
                this.firstSquareClicked = null;
                this.secondSquareClicked = null;
                }
                
            })

        });

        // console.log(`\t\t\tFunc: END initLocalEventListeners (BoardInteractive)`);

    };

    undoMove() {
        // Check if there are moves to undo
        if (this.moveHistory.length === 0) {
            console.log("No moves to undo");
            return;
        }

        // Pop the last move from the history stack
        const lastMove = this.moveHistory.pop();


        // Now i need logic to reverse the move. This may involve creating pieces or registering board states
        // Example:
        // If you have a method to move a piece back to its original position:
        // this.movePiece(lastMove.piece, lastMove.originalPosition);
    }

    #logMovement() {
        // Determine the text that gets updated
        // const pgnTextBox = document.querySelector("#pgnInput")

        // Is there a capture?
        let isCapture = false
        let isPawnCapture = false
        if (this.firstSquareClicked.contents && this.secondSquareClicked.contents) {isCapture = true}

        // If it was a pawn capture
        if (isCapture && this.firstSquareClicked.contents.pieceCodeStr === "p") {isPawnCapture = true}


        // Piece that was moved
        let pieceCode = this.firstSquareClicked.contents.pieceCodeStr
        if (pieceCode === "p") {pieceCode = ""}


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
        }
        else if (isCapture && isPawnCapture) {
            finalResult = pawnFileCapture + "x" + destination + " ";
        }

        // If its white move, add the turn number
        if (this.turnTeamNumber === 0) {
            this.storedPGN += `${this.turnNumber}.`
            this.turnNumber++
        }


        this.storedPGN += finalResult

        console.log(this.storedPGN)
        // After updating storedPGN, notify the callbacks
        this.notifyStoredPGNChange();
    }

};



export {Game, GameTest, GameInteractive};





import StaticGameLogic from './StaticGameLogic.js';
import StaticParser from './StaticChessParser.js';
import  { Board, BoardDisplay, BoardInteractive} from './Board.js';

class Game {
    #parentElement;
    #element;
    #className;
    #classSubName;
    #idNumber;
    #information;
    #parser;
    #board;
    constructor(information, idNumber) {
    console.log(`\tFunc: START constructor (Game)`);
        this.#parentElement = document.createElement('div');
        this.#idNumber = idNumber;                          // Unique Id number, helps search for Games and Chessboards
        this.#information = information                     // JSON returned information from the Dictionary() object
        this.#className = "Game"                            // Type of the class
        this.#classSubName = "";                          
        this.#board = null                                  // Board() object. Holds the chess pieces and logic
        this.#element = this.createContainer()            // element for the DOM
        this.#parser = null                                 // Object of every move and their instructions. Used in Logic()
    console.log(`\tFunc: END constructor (Game)`);  
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

    returnChessboard() {
        return this.board;
    };

    // setInformation() {
    //     this.#information = 
    // }
    
    updateGameInformation(info) {
        this.gameInformation = info
        this.parser = info.PGN
    };
    
    setParser() {
        this.#parser = new StaticParser(this.gameInformation.PGN)
    }





    // this.element.className = `chessboard`;
    // this.element.id = `chessboard${this.idNumber}`;
    // this.parentElement.appendChild(this.element);






    runGameWithParserObject() {
        StaticGameLogic.processAllMoves(this.board, this.parser);
    }

    render() {
        this.#parentElement.appendChild(this.element)    
    };

    print() {
        this.returnChessboard().printToTerminal()
    }

    initAndRender(opening) {
        this.updateGameInformation(opening)
        this.runGameWithParserObject()
        this.addInfoToElement(opening)
        this.render()
    }

};



// DisplayGame class handles rendering and user interactions
class GameLarge extends Game {
    constructor(information, idNumber, parentElement) {
        // console.log(`\tFunc: START constructor (GameLarge)`);
        super(information, idNumber, parentElement);
        this.parentElement = parentElement ? parentElement: document.createElement('div');

        this.turnNumber = 1;
        this.turnTeamNumber = 0
        this.storedPGN = ""
        
        this.onStoredPGNChangeCallbacks = []; // Array to store callback functions


        this.createChessBoard()
        this.initLocalEventListeners()
        // console.log(`\tFunc: END constructor (GameLarge)`);
    };


    createContainer() {
        return this.element = Object.assign(
            document.createElement('div'),
            {
                className: 'chessboard-container large',
                id: `chessboard-container${this.idNumber}`
            }
        );
    };


    createChessBoard() {
        this.board = new BoardInteractive(0, this.element);
    };

    addInfoToElement(gameInformation) {
        const infoFields = ['PGN', 'NAME', 'ECO', 'NEXTTOMOVE', 'FAMILY', 'VARIATION', 'SUBVARIATION', 'NUMMOVES'];
        const labels = ['PGN:', 'NAME:', 'ECO:', 'NEXT:', 'FAMILY:', 'VARIATION:', 'SUB VARIATION:', 'NUMMOVES'];
    
        infoFields.forEach((field, index) => {
            const infoEl = document.createElement('p');
            infoEl.classList.add(infoFields[index].toLowerCase());
    
            const boldEl = document.createElement('strong');
            boldEl.appendChild(document.createTextNode(labels[index]));
    
            infoEl.appendChild(boldEl);
            infoEl.appendChild(document.createTextNode(' '));
    
            const infoTxt = document.createTextNode(gameInformation[field] || '');
            infoEl.appendChild(infoTxt);
    
            this.element.appendChild(infoEl);
        });
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
                // console.log(this.storedPGN)


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


class GameSmall extends Game {
    constructor(information, idNumber, parentElement) {
        // console.log(`\tFunc: START constructor (GameSmall)`);
        super(information, idNumber, parentElement);
        this.parentElement = parentElement ? parentElement: document.createElement('div');
        this.createChessBoard() // Creates and populates the Board() object
    };


    createChessBoard() {
        this.board = new BoardDisplay(0, this.element);
    };


    createContainer() {
        return this.element = Object.assign(
            document.createElement('div'),
            {
                className: 'chessboard-container small',
                id: `chessboard-container${this.idNumber}`,
            }
        );
    };


    addInfoToElement(gameInformation) {
        const infoFields = ['NAME', 'FAMILY', 'VARIATION', 'SUBVARIATION', 'NUMMOVES', 'PGN'];
        const labels = ['NAME:', 'FAMILY:', 'VARIATION:', 'SUB VARIATION:', 'NUMMOVES', 'PGN'];
    
        infoFields.forEach((field, index) => {
            const infoEl = document.createElement('p');
            infoEl.classList.add(infoFields[index].toLowerCase());
    
            const boldEl = document.createElement('strong');
            boldEl.appendChild(document.createTextNode(labels[index]));
    
            infoEl.appendChild(boldEl);
            infoEl.appendChild(document.createTextNode(' '));
    
            const infoTxt = document.createTextNode(gameInformation[field] || '');
            infoEl.appendChild(infoTxt);
    
            this.element.appendChild(infoEl);
        });
    };
};







export {Game, GameLarge, GameSmall};





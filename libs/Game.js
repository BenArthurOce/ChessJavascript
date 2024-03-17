import StaticGameLogic from './StaticGameLogic.js';
import StaticParser from './StaticChessParser.js';
import  { Board, BoardInteract } from './Board.js';



class Game {
    #parentElement = null;
    #element = null;
    #className = "Game";
    #idNumber = null;
    #information = null;
    #parser = null;
    #board = null;

    constructor(information, idNumber, parentElement) {

        // console.log(information, idNumber, parentElement)
        this.#parentElement = parentElement;
        this.#idNumber = idNumber;
        this.#information = null;
        this.#parser = null;
        this.#board = new Board(this.#idNumber, this.#createGameElement());

        if (information) {
            this.#information = information;
            this.#parser = new StaticParser(information.PGN)
            this.#addInfoToElement();
        }
    };
    get parentElement() {
        return this.#parentElement;
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


    initGame() {
        if (!this.#parser) {
            throw new Error ("initGame - Parser object is null - Logic will not run")
        }
        StaticGameLogic.processAllMoves(this.#board, this.#parser);
    };


    #createGameElement() {
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


    handleBoardClick(event) {
        console.log(this.information.NAME)
    };
    

    /**
     * TransferGameToDOM - WIP
     * 
     */
    // #TransferGameToDOM() {
    //     this.#board.grid.flat().forEach(square => {
    //         if (square.contents) {
    //             square.setPiece(square.contents);
    //         }
    //     });
    // };


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

        // this.#board.grid.flat().forEach(square => {
        //     square.clearContents();
        // });
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









// import StaticGameLogic from './StaticGameLogic.js';
// import StaticParser from './StaticChessParser.js';
// import {Board, BoardInteract} from './Board.js';


// class Game {
//     #parentElement = null;
//     #element = null;
//     #className = "Game";
//     #idNumber = null;
//     #information = null;
//     #parser = null;
//     #board = null;

//     constructor(information, idNumber, parentElement) {

//         // console.log(information, idNumber, parentElement)
//         this.#parentElement = parentElement;
//         this.#idNumber = idNumber;
//         this.#information = null;
//         this.#parser = null;
//         this.#board = new Board(this.#idNumber, this.#createGameElement());

//         if (information) {
//             this.#information = information;
//             this.#parser = new StaticParser(information.PGN)
//             this.#addInfoToElement();
//         }
//     };
//     get parentElement() {
//         return this.#parentElement;
//     };
//     get element() {
//         return this.#element;
//     };
//     set element(value) {
//         this.#element = value;
//     };
//     get className() {
//         return this.#className;
//     };
//     get idNumber() {
//         return this.#idNumber;
//     };
//     get information() {
//         return this.#information;
//     };
//     get parser() {
//         return this.#parser;
//     };
//     get board() {
//         return this.#board;
//     };


//     initGame() {
//         if (!this.#parser) {
//             throw new Error ("initGame - Parser object is null - Logic will not run")
//         }
//         StaticGameLogic.processAllMoves(this.#board, this.#parser);
//     };


//     #createGameElement() {
//         const chessboardContainer = document.createElement('div');
//         chessboardContainer.className = 'chessboard-container';
//         chessboardContainer.id = `chessboard-container${this.#idNumber}`;
//         this.#parentElement.appendChild(chessboardContainer);
//         this.#element = chessboardContainer;
//         return chessboardContainer;
//     };


//     #addInfoToElement() {
//         const infoFields = ['PGN', 'NAME', 'ECO', 'NEXTTOMOVE', 'FAMILY', 'VARIATION', 'NUMMOVES'];
//         const labels = ['PGN:', 'NAME:', 'ECO:', 'NEXT:', 'FAMILY:', 'VARIATION:', 'NUMMOVES']; // Bold text labels
//         infoFields.forEach((field, index) => {
//             const infoEl = document.createElement('p');
//             infoEl.classList.add(infoFields[index].toLowerCase())
//             // Create a bold element for the label
//             const boldEl = document.createElement('strong');
//             const boldTxt = document.createTextNode(labels[index]);
//             boldEl.appendChild(boldTxt);
//             infoEl.appendChild(boldEl);
//             // Add a space between the label and the information
//             infoEl.appendChild(document.createTextNode(' '));
//             // Append the information text
//             const infoTxt = document.createTextNode(this.#information[field]);
//             infoEl.appendChild(infoTxt);
//             this.#element.appendChild(infoEl);
//         });
//     };


//     handleBoardClick(event) {
//         console.log(this.information.NAME)
//     };
    

//     /**
//      * TransferGameToDOM - WIP
//      * 
//      */
//     // #TransferGameToDOM() {
//     //     this.#board.grid.flat().forEach(square => {
//     //         if (square.contents) {
//     //             square.setPiece(square.contents);
//     //         }
//     //     });
//     // };


//     /**
//      * resetGame - WIP
//      */
//     resetGame() {
//         // Currently triggered from the "Delete button" in the Game() object
//         // Clears all squares of pieces
        
//         // Define board as flat array
//         const boardFlat = this.board.grid.flat()

//         for (let i = 0; i < boardFlat.length && i < boardFlat.length; i++) {
//             const squareObj = boardFlat[i];
//             squareObj.clearContents()            
//         }

//         // this.#board.grid.flat().forEach(square => {
//         //     square.clearContents();
//         // });
//     };
// };


// // // This is a class designed to disregard all elements / parent elements and just run without a display. printToTerminal will display the board
// // class GameTest extends Game {
// //     constructor(information) {
// //         super(information);    
// //     };

// //     initTestGame() {
// //         StaticGameLogic.processAllMoves(this.board, this.parser)
// //     };

// //     getBoardObject() {
// //         return this.board;
// //     }
// // };


// // export {Game, GameTest};
// export default Game
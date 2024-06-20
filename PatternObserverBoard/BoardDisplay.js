import BoardObserver from './BoardObserver.js';

class BoardDisplay extends BoardObserver {
    constructor(boardElement) {
        super();
        this.boardElement = boardElement;
    }

    update(subject) {
        this.displayBoard(subject);
    }

    displayBoard(board) {
        // Code to update the board display in the UI
        console.log("Updating board display...");
        // Example: Display board in console
        board.printToTerminal();
    }
}

export default BoardDisplay;

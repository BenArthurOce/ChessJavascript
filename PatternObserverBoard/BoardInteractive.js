import BoardObserver from './BoardObserver.js';

class BoardInteractive extends BoardObserver {
    constructor(boardElement) {
        super();
        this.boardElement = boardElement;
    }

    update(subject) {
        this.updateInteractivity(subject);
    }

    updateInteractivity(board) {
        // Code to update the interactivity in the UI
        console.log("Updating board interactivity...");
        // Example: Re-bind event listeners or update UI elements
    }
}

export default BoardInteractive;

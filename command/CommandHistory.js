//This file defines a class for maintaining the history of executed commands, which is essential for implementing undo and redo functionality.

class CommandHistory {
    constructor() {
        this.history = [];
    }

    addToHistory(command) {
        this.history.push(command);
    }

    clearHistory() {
        this.history = [];
    }
}

export default CommandHistory;

//This file defines a command manager class responsible for managing the execution, undo, and redo of commands.

class CommandManager {
    constructor() {
        this.commandHistory = [];
        this.undoHistory = [];
    }

    execute(command) {
        command.execute();
        this.commandHistory.push(command);
    }

    undo() {
        const command = this.commandHistory.pop();
        if (command) {
            command.undo();
            this.undoHistory.push(command);
        }
    }

    redo() {
        const command = this.undoHistory.pop();
        if (command) {
            command.execute();
            this.commandHistory.push(command);
        }
    }
}

export default CommandManager;

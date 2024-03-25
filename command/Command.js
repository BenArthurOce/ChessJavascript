// This file defines the base Command class, which represents a command to be executed.

class Command {
    constructor() {
        if (this.constructor === Command) {
            throw new Error("Abstract class 'Command' cannot be instantiated directly.");
        }
    }

    execute() {
        throw new Error("Method 'execute' must be implemented.");
    }

    undo() {
        throw new Error("Method 'undo' must be implemented.");
    }
}

export default Command;

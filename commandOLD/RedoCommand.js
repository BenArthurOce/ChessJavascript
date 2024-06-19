//This file defines a subclass of Command for representing redo commands.


import Command from './Command.js';

class RedoCommand extends Command {
    constructor(commandManager) {
        super();
        this.commandManager = commandManager;
    }

    execute() {
        this.commandManager.redo();
    }

    undo() {
        // Undoing a redo command doesn't make sense
    }
}

export default RedoCommand;

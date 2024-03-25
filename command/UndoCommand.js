//This file defines a subclass of Command for representing undo commands.


import Command from './Command.js';

class UndoCommand extends Command {
    constructor(commandManager) {
        super();
        this.commandManager = commandManager;
    }

    execute() {
        this.commandManager.undo();
    }

    undo() {
        // Undoing an undo command doesn't make sense
    }
}

export default UndoCommand;

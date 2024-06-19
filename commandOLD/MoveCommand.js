// This file defines a subclass of Command for representing move commands in a chess game.


import Command from './Command.js';

class MoveCommand extends Command {
    constructor(piece, sourceSquare, targetSquare) {
        super();
        this.piece = piece;
        this.sourceSquare = sourceSquare;
        this.targetSquare = targetSquare;
    }

    execute() {
        // Logic to execute the move
    }

    undo() {
        // Logic to undo the move
    }
}

export default MoveCommand;

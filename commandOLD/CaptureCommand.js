//This file defines a subclass of Command for representing capture commands in a chess game


import Command from './Command.js';

class CaptureCommand extends Command {
    constructor(piece, sourceSquare, targetSquare, capturedPiece) {
        super();
        this.piece = piece;
        this.sourceSquare = sourceSquare;
        this.targetSquare = targetSquare;
        this.capturedPiece = capturedPiece;
    }

    execute() {
        // Logic to execute the capture
    }

    undo() {
        // Logic to undo the capture
    }
}

export default CaptureCommand;

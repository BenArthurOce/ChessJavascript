import Command from "./Command";


// MovePieceCommand class
class MovePieceCommand extends Command {
    constructor(board, piece, targetPosition, initialPosition) {
        super();
        this.board = board;
        this.piece = piece;
        this.targetPosition = targetPosition;
        this.initialPosition = initialPosition;
    }

    execute() {
        this.board.movePiece(this.piece, this.targetPosition);
    }

    undo() {
        this.board.movePiece(this.piece, this.initialPosition);
    }
}

export default MovePieceCommand;
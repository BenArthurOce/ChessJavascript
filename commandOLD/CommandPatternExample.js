// Command interface
class Command {
    execute() {}
  }
  
  // Concrete command for moving a chess piece
  class MovePieceCommand extends Command {
    constructor(piece, targetPosition) {
      super();
      this.piece = piece;
      this.targetPosition = targetPosition;
      this.previousPosition = null;
    }
    
    execute() {
      // Backup previous position
      this.previousPosition = this.piece.getPosition();
      
      // Move the piece to the target position
      this.piece.moveTo(this.targetPosition);
    }
    
    undo() {
      // Move the piece back to its previous position
      this.piece.moveTo(this.previousPosition);
    }
  }
  
  // Receiver representing a chess piece
  class ChessPiece {
    constructor(name, position) {
      this.name = name;
      this.position = position;
    }
    
    getPosition() {
      return this.position;
    }
    
    moveTo(newPosition) {
      console.log(`${this.name} moved from ${this.position} to ${newPosition}`);
      this.position = newPosition;
    }
  }
  
  // Invoker representing the player
  class Player {
    constructor() {
      this.commandHistory = [];
    }
    
    executeCommand(command) {
      command.execute();
      this.commandHistory.push(command);
    }
    
    undoLastMove() {
      if (this.commandHistory.length > 0) {
        const lastCommand = this.commandHistory.pop();
        lastCommand.undo();
      } else {
        console.log("No moves to undo.");
      }
    }
  }
  
  // Client
  const player = new Player();
  const rook = new ChessPiece("Rook", "A1");
  const moveCommand = new MovePieceCommand(rook, "A4");
  
  player.executeCommand(moveCommand); // Output: "Rook moved from A1 to A4"
  player.undoLastMove(); // Output: "Rook moved from A4 to A1"
  
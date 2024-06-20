// Define the context that uses the strategy
class ChessPiece {
    constructor(color, position) {
      this.color = color;
      this.position = position;
    }
  
    // Context method that delegates to the strategy
    move() {
      return this.movementStrategy.move(this.position);
    }
  
    // Setter method to change the strategy dynamically
    setMovementStrategy(strategy) {
      this.movementStrategy = strategy;
    }
  }
  
  // Define the strategy interface
  class MovementStrategy {
    move(position) {
      throw new Error('This method should be overridden');
    }
  }
  
  // Define concrete strategies for each chess piece type
  
  class PawnMovement extends MovementStrategy {
    move(position) {
      // Implement pawn movement logic here
      return `Pawn moves to ${position}`;
    }
  }
  
  class KnightMovement extends MovementStrategy {
    move(position) {
      // Implement knight movement logic here
      return `Knight moves to ${position}`;
    }
  }
  
  class BishopMovement extends MovementStrategy {
    move(position) {
      // Implement bishop movement logic here
      return `Bishop moves to ${position}`;
    }
  }
  
  // Example usage
  
  // Create a new Pawn piece
  const pawn = new ChessPiece('white', 'A2');
  
  // Set the movement strategy for the Pawn
  pawn.setMovementStrategy(new PawnMovement());
  
  // Move the Pawn
  console.log(pawn.move()); // Output: Pawn moves to A2
  
  // Change the movement strategy dynamically (e.g., switch to Knight)
  pawn.setMovementStrategy(new KnightMovement());
  
  // Move the Pawn (now behaves like a Knight)
  console.log(pawn.move()); // Output: Knight moves to A2
  
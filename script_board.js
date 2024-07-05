



import BoardUsingFEN from './PatternObserverBoard/Board.js';
import BoardDisplay from './PatternObserverBoard/BoardDisplay.js';
import BoardInteractive from './PatternObserverBoard/BoardInteractive.js';

// import BoardUsingFEN from './PatternObserverBoard/Board.js';

// Create a new board
const boardElement = document.getElementById('chess-board');
const board = new BoardUsingFEN(1, boardElement, 'initial FEN string');

// Create observers
const boardDisplay = new BoardDisplay(boardElement);
const boardInteractive = new BoardInteractive(boardElement);

// Register observers
board.registerObserver(boardDisplay);
board.registerObserver(boardInteractive);

// Initialize board
board.initSquares();
board.initPieces('initial FEN string');

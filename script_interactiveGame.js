// import {Game, GameTest, GameInteract} from "./libs/Game.js";
import { Board, BoardInteract } from "./libs/Board.js";


const parentELMain = document.querySelector("#wrapper2");

const myBoard = new BoardInteract(null, parentELMain)


// myBoard.createElement()
// myBoard.initSquares()
// myBoard.initPieces()
myBoard.initLocalEventListeners()


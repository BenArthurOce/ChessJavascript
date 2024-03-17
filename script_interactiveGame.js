// import {Game, GameTest, GameInteract} from "./libs/Game.js";
import { Board, BoardInteractive } from "./libs/Board.js";


const parentELMain = document.querySelector("#wrapper2");

const myBoard = new BoardInteractive(null, parentELMain)


// myBoard.createElement()
// myBoard.initSquares()
// myBoard.initPieces()
// myBoard.initLocalEventListeners()

myBoard.init()
myBoard.initLocalEventListeners()


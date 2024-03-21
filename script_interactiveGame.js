import { Game, GameTest, GameInteractive } from "./libs/Game.js";


const parentELMain = document.querySelector("#main-board-container");
const myGame = new GameInteractive(null, 0, parentELMain);


myGame.init()
myGame.initLocalEventListeners()


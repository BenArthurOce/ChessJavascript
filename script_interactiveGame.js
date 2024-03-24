import { Game, GameLarge, GameSmall} from "./libs/Game.js";

function printPGN() {
    console.log(myGame.storedPGN)
}

const parentELMain = document.querySelector("#main-board-container");
const myGame = new GameLarge(null, 0, parentELMain, printPGN);
myGame.render()

console.log(myGame.callback)
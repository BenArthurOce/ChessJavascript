// This script is to disregard the website functionality, and to test the notation strings and see what errors come up
// This script does not automatically resolve errors, however. 


import {Game, GameTest} from "./libs/Game.js";
import JSONReader from "./libs/JSONReader.js";
import {Dictionary, ChessDictionary} from "./libs/Dictionary.js";


// Step 1: We read the JSON file of all the openings
const jsonReader = new JSONReader('data/newChessOpenings.json');  // Loading JSON Reader
jsonReader.readJSONSync();
const jsonData = jsonReader.getData();  // Accessing data

// Step 2: Create a Dictionary() object and populate it with the JSON data
const openingDictionary = new ChessDictionary();   // Creating a new Dictionary instance

// Transferring JSON data to Dictionary
for (const key in jsonData) {
  if (Object.hasOwnProperty.call(jsonData, key)) {
    openingDictionary.set(key, jsonData[key]);
  }
}


// Comment one of the following out:

//-------------------------------------RUNS/TESTS A SINGLE GAME-------------------------------------
// const testNotation = `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. Nge2 dxe4 5. a3 Be7 6. Nxe4 Nf6 7. N2g3 O-O 8. Be2 Nc6`

// const gameInformation = openingDictionary.get(testNotation)
// let gameTest = new GameTest(gameInformation)
// gameTest.initTestGame()
// gameTest.board.printToTerminal()


///-------------------------------------RUNS ALL GAMES-------------------------------------
let index = 0
openingDictionary.forEach((key, value) => {
  index +=1 
    console.log(index)  // Print the number
    let gameTest = new GameTest(value)
    console.log(gameTest.information.PGN) // Print the game notation
    gameTest.initTestGame()
    // gameTest.board.printToTerminal()
});



console.log("NO ERRORS FOUND WOOO")



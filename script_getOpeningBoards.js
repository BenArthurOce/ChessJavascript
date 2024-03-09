// This script is to get the actual character string of the board position
// We can then add this to the JSON file as a faster reference to load up opening information
// It also helps when a position is achieved in the same way, but the notation is different.

import {Game, GameTest} from "./libs/Game.js";
import JSONReader from "./libs/JSONReader.js";
import Dictionary from "./libs/Dictionary.js";


// Step 1: We read the JSON file of all the openings
const jsonReader = new JSONReader('data/newChessOpenings.json');  // Loading JSON Reader
jsonReader.readJSONSync();
const jsonData = jsonReader.getData();  // Accessing data

// Step 2: Create a Dictionary() object and populate it with the JSON data
const openingDictionary = new Dictionary();   // Creating a new Dictionary instance

// Transferring JSON data to Dictionary
for (const key in jsonData) {
  if (Object.hasOwnProperty.call(jsonData, key)) {
    openingDictionary.set(key, jsonData[key]);
  }
}


///-------------------------------------RUNS ALL GAMES-------------------------------------
let results = [];
let index = 0;
openingDictionary.forEach((key, value) => {
    index += 1;
    // console.log(index)  // Print the number
    let gameTest = new GameTest(value);
    // console.log(gameTest.information.PGN) // Print the game notation
    const theBoard = gameTest.getBoardObject();

    // console.log(theBoard.getArray("code", "--").flat())
    // console.log(gameTest.board.this.getArray("code", "--"))
    gameTest.initTestGame();
    const flatarray = theBoard.getArray("code", "-").flat();
    // console.log(flatarray)
    // gameTest.board.printToTerminal()
    const flatTextArray = flatarray.toString();
    // console.log(flatarray.toString())

    // console.log(flatTextArray)
    results.push("[" + flatTextArray + "]");
});

console.log(results);

let content = "";

results.forEach((flatTextArray, index) => {
    console.log(index + 1); // Print the number
    console.log(flatTextArray);

    // Append each line to the content string with a newline
    content += flatTextArray + "\n";
});

// Create a Blob object with the content
const blob = new Blob([content], { type: "text/plain" });

// Create a temporary anchor element to trigger the download
const anchor = document.createElement("a");
anchor.href = window.URL.createObjectURL(blob);
anchor.download = "output.txt";

// Trigger the download
anchor.click();



// let stringData = "[1R,1N,1B,1Q,1K,1B,1N,1R,1p,1p,1p,1p,1p,1p,1p,1p,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,0N,0p,0p,0p,0p,0p,0p,0p,0p,0R,0N,0B,0Q,0K,0B,-,0R]";

// // Remove square brackets and split the string at each comma
// let dataArray = stringData.substring(1, stringData.length - 1).split(',');

// console.log(dataArray);
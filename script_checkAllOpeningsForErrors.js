/*
    script_checkAllOpeningsForErrors.js
*/

/* 
    This script takes the dictionary, and using "StaticGameLogic", runs the logic through every dictionary opening and determines if anything has errors
    If an error is found, the code will stop on that opening and display to the user in the terminal

    The script creates a temp Game object that doesnt use any DOM elements, and runs the Game with the Parser and operates the Logic
*/


import {Game, GameLarge, GameSmall, GameTest} from "./libs/GameUsingLogic.js";
import JSONReader from "./libs/JSONReader.js";
import {Dictionary, ChessDictionary} from "./libs/Dictionary.js";

const filePath = 'data/2024.07.05_chessOpenings.json';


//
// Part 1: Get current chess dictionary
//
const jsonReader = new JSONReader(filePath);  // Loading JSON Reader
jsonReader.readJSONSync();
const jsonData = jsonReader.getData();  // Accessing data

const openingDictionary = new Dictionary();   // Creating a new Dictionary instance

for (const key in jsonData) {
    if (Object.hasOwnProperty.call(jsonData, key)) {
        openingDictionary.set(key, jsonData[key]);
    }
};



//
// Part 2: Create a game object specific to this script
//
class GameScript extends Game {

    constructor(information) {
        super(information);
    };
};


//
// Part 3: Run All Games with each opening
//
openingDictionary.forEach((key, value) => {
    console.log(`Running Opening ID: ${value['ID']}`)
    let game = new GameScript(value);

    // All these functions are found in "GameUsingLogic"
    game.setParser()
    game.createDummyBoard()
    game.runGameWithParserObject()
});




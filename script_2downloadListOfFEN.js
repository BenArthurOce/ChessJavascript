/*
    Script Name: script_2downloadListOfFEN.js
*/


/*
    To operate this:
    Run the script in the browser
    It will download a list of FEN
*/



import { Game, GameLarge, GameSmall, GameTest } from "./libs/GameUsingLogic.js";
import JSONReader from "./libs/JSONReader.js";
import { Dictionary, ChessDictionary } from "./libs/Dictionary.js";

const filePath = 'data/openings_no_fen.json';
const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"

// Part 1: Get current chess dictionary
const jsonReader = new JSONReader(filePath);  // Loading JSON Reader
jsonReader.readJSONSync();
const jsonData = jsonReader.getData();  // Accessing data

const openingDictionary = new Dictionary();   // Creating a new Dictionary instance

for (const key in jsonData) {
    if (Object.hasOwnProperty.call(jsonData, key)) {
        openingDictionary.set(key, jsonData[key]);
    }
}

// Part 2: Create a game object specific to this script
class GameScript extends Game {
    constructor(information) {
        super(information);
    }

    // Takes the Board() object of Game(), and returns the FEN.
    constructFEN() {
        const myBoard = this.board.getArray("fen", "-");

        function rowToFEN(row) {
            let fenRow = '';
            let emptyCount = 0;
            for (let square of row) {
                if (square === '-') {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        fenRow += emptyCount;
                        emptyCount = 0;
                    }
                    fenRow += square;
                }
            }
            if (emptyCount > 0) {
                fenRow += emptyCount;
            }
            return fenRow;
        }

        const fenRows = myBoard.map(rowToFEN);
        return fenRows.join('/');
    }
}

// Part 3: Run All Games with each opening and add FEN to JSON
const arrayOfFEN = [];
arrayOfFEN.push(startingFen)
openingDictionary.forEach((key, value) => {
    // console.log(`Running Opening ID: ${value['ID']}`);
    let game = new GameScript(value);

    // All these functions are found in "GameUsingLogic"
    game.setParser();
    game.createDummyBoard();
    game.runGameWithParserObject();

    // Build FEN
    const fen = game.constructFEN();
    arrayOfFEN.push(fen);

});


console.log(openingDictionary.table)

// Create a data URI for the text file
const data = arrayOfFEN.join('\n');
const blob = new Blob([data], { type: 'text/plain' });
const url = URL.createObjectURL(blob);

// Create a link element to trigger download
const link = document.createElement('a');
link.href = url;
link.download = 'fen_strings.txt';

// Trigger download
document.body.appendChild(link);
link.click();

// Clean up
document.body.removeChild(link);
URL.revokeObjectURL(url);

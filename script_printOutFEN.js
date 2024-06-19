import { Game, GameSmall } from "./libs/GameUsingLogic.js";
import JSONReader from "./libs/JSONReader.js";
import { Dictionary, ChessDictionary } from "./libs/Dictionary.js";

class ChessOpeningsTest {
  #dictionary;

  constructor() {
    this.#dictionary = new ChessDictionary();
  }

  // Step 1: We read the JSON file of all the openings
  async initDictionary() {
    const filepath = './data/openings_data.json';

    // Find the JSON file and read the data
    const jsonData = await this.readJSONFile(filepath);

    // Go through each JSON item and add it to the Dictionary() class
    Object.entries(jsonData).forEach(([key, value]) => this.#dictionary.set(key, value));

    // In the Dictionary() Object, parse "MOVESTRING" into "MOVEOBJ"
    this.#dictionary.updateWithMoveObj();
  }

  // Convert JSON file into a javascript object
  async readJSONFile(filePath) {
    const jsonReader = new JSONReader(filePath);
    return await jsonReader.readJSON();
  }

  get dictionary() {
    return this.#dictionary;
  }
}

// Instantiate the class and initialize the dictionary
const chessTest = new ChessOpeningsTest();
await chessTest.initDictionary();

///-------------------------------------PRINTS OUT THE FEN OF EACH GAME-------------------------------------
let index = 0;
const arrayOfFEN = [];
chessTest.dictionary.forEach((value, key) => {
  index += 1;
  console.log(index);  // Print the number
  
  let gameTest = new GameSmall(key, index);
  
  gameTest.setParser();
  gameTest.createChessBoardFORTESTING();
  gameTest.runGameWithParserObject();
  
  const newFEN = gameTest.board.constructFEN();
  arrayOfFEN.push(newFEN);
});

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

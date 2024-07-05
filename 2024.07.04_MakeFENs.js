import {
    DictionarySearchStrategy,
    SearchByKeyStrategy,
    SearchByValueStrategy,
    SearchByIdStrategy,
    SearchByFENStrategy,
    SearchByECOStrategy,
    SearchByNameStrategy,
    SearchByNumTurnsStrategy,
    SearchByNumMovesStrategy,
    SearchByContinuationsNextStrategy
} from "./PatternSearchDictionary/DictionarySearchStrategy.js";
import DictionarySearchContext from "./PatternSearchDictionary/DictionarySearchContext.js";
import DictionaryNEW from "./PatternSearchDictionary/DictionaryNew.js";
import JSONReaderNEW from "./PatternSearchDictionary/JSONReaderNEW.js";

import {Game, GameTest} from "./libs/Game.js";


// PART ONE - CREATE DICTIONARY
//////////////////////////////////////////

let dictionary = new DictionaryNEW();

// Step 1: We read the JSON file of all the openings
async function initDictionary() {
    const filepath = './csv_parsed_data.json';

    // Find the JSON file and read the data
    const jsonData = await readJSONFile(filepath);

    // Go through each JSON item and add it to the Dictionary() class
    Object.entries(jsonData).forEach(([key, value]) => dictionary.set(key, value));

}

// Convert JSON file into a javascript object
async function readJSONFile(filePath) {
    const jsonReader = new JSONReaderNEW(filePath);
    return await jsonReader.readJSON();
}

await initDictionary();


// PART TWO - TEST SEARCHING
//////////////////////////////////////////


// Create a search context
const searchContext = new DictionarySearchContext(new SearchByIdStrategy());

// Search by ID
let result = searchContext.search(dictionary, { ID: 2 });
console.log(result); // Output: Entry with ID 2




// PART TWO - TEST GAME USING LOGIC
//////////////////////////////////////////


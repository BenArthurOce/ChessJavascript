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


// PART ONE - CREATE DICTIONARY
//////////////////////////////////////////

let dictionary = new DictionaryNEW();

// Step 1: We read the JSON file of all the openings
async function initDictionary() {
    const filepath = './data/openings_data.json';

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

// Change strategy to search by FEN
searchContext.setStrategy(new SearchByFENStrategy());
result = searchContext.search(dictionary, { FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" });
console.log(result); // Output: Entry with FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"

// Change strategy to search by ECO
searchContext.setStrategy(new SearchByECOStrategy());
result = searchContext.search(dictionary, { ECO: "A00" });
console.log(result); // Output: Entries with ECO "A00"

// Change strategy to search by NAME
searchContext.setStrategy(new SearchByNameStrategy());
result = searchContext.search(dictionary, { NAME: "Amar Opening" });
console.log(result); // Output: Entries with NAME containing "Amar Opening"

// Change strategy to search by Number of Turns
searchContext.setStrategy(new SearchByNumMovesStrategy());
result = searchContext.search(dictionary, { NUMMOVES: 5 });
console.log(result);

// Change strategy to search by Number of Moves
searchContext.setStrategy(new SearchByNumTurnsStrategy());
result = searchContext.search(dictionary, { NUMTURNS: 11 });
console.log(result);

// Change strategy to search by Number of Moves
searchContext.setStrategy(new SearchByContinuationsNextStrategy());
result = searchContext.search(dictionary, { ID: 1 });
console.log(result)

// Change strategy to search by Number of Moves
searchContext.setStrategy(new SearchByContinuationsNextStrategy());
result = searchContext.search(dictionary, {ID: 1});
console.log(result);

console.log("----------------------------")
console.log("----------------------------")
console.log("----------------------------")




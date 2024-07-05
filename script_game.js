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










import {Game, GameLarge, GameSmall} from "./PatternObserverGame/Game.js";
import GameObserver from "./PatternObserverGame/GameObserver.js";
import GameSubject from "./PatternObserverGame/GameSubject.js";


let opening = ''
let idNumber = ''
let parentElement = ''
let fen = ''
// let opening = ''


const searchContext = new DictionarySearchContext(new SearchByIdStrategy());
searchContext.setStrategy(new SearchByFENStrategy());
opening = searchContext.search(dictionary, { FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" });
console.log(opening)


const mainGame = new GameLarge(opening, idNumber, parentElement, (fen) => {
    // Callback function when main board state changes
    console.log("Main board FEN updated:", fen);
});

// Dynamically create small boards and attach them as observers
const numberOfVariations = 5; // This number should be based on your logic to determine possible move variations
for (let i = 0; i < numberOfVariations; i++) {
    const smallGame = new GameSmall(information, i, document.createElement('div'), mainGame.returnFEN());
    mainGame.attach(smallGame);
    smallGame.render(); // Ensure to render the small boards
}

// Render the main game
mainGame.render();

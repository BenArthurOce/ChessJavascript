
import {Game, GameTest} from "./Game.js";
import JSONReader from "./JSONReader.js";
import Dictionary from "./Dictionary.js";


class FrontPage {
    #className;
    #mainGameBoard;
    #sideGameBoards;
    #elements;
    #allTwoMoveContinuations;
    #allThreeMoveContinuations;
    #dictionary;
    constructor() {
        this.#className = "Board";
        this.#mainGameBoard = null;
        this.#sideGameBoards = [];

        this.#allTwoMoveContinuations = []      // Not currently used
        this.#allThreeMoveContinuations = []    // Not currently used
        this.#dictionary = new Dictionary()     // Holds all the chess openings and information about them

        this.initMainBoard()
        this.initOpeningDictionary()
        this.initSearchInput();
    };
    get className() {
        return this.#className;
    };
    set className(value) {
        this.#className = value;
    };
    get mainGameBoard() {
        return this.#mainGameBoard;
    };
    set mainGameBoard(value) {
        this.#mainGameBoard = value;
    };
    get sideGameBoards() {
        return this.#sideGameBoards;
    };
    set sideGameBoards(value) {
        this.#sideGameBoards = value;
    };
    get elements() {
        return this.#elements;
    };
    get allTwoMoveContinuations() {
        return this.#allTwoMoveContinuations;
    };
    set allTwoMoveContinuations(value) {
        this.#allTwoMoveContinuations = value;
    };
    get allThreeMoveContinuations() {
        return this.#allThreeMoveContinuations;
    };
    set allThreeMoveContinuations(value) {
        this.#allThreeMoveContinuations = value;
    };
    get dictionary() {
        return this.#dictionary;
    };
    set dictionary(value) {
        this.#dictionary = value;
    };


    initMainBoard() {
        const parentEL = document.body.querySelector("#main-board-container");
        this.mainGameBoard = new Game(null, 0, parentEL);
        this.mainGameBoard.resetGame()
    };


    updateMainBoard(information) {
        this.clearMainBoard()
        const parentEL = document.body.querySelector("#main-board-container");
        this.mainGameBoard = null
        this.mainGameBoard = new Game(information, 0, parentEL);
        this.mainGameBoard.initGame();
    };


    clearMainBoard() {
        const mainBoard = document.body.querySelector("#main-board-container");
        while (mainBoard.firstChild) {
            mainBoard.removeChild(mainBoard.firstChild);
        }
    };


    initOpeningDictionary() {
        // Step 1: We read the JSON file of all the openings
        const jsonReader = new JSONReader('./data/newChessOpenings.json');  // Loading JSON Reader
        jsonReader.readJSONSync();
        const jsonData = jsonReader.getData();  // Accessing data

        // Step 2: Create a Dictionary() object and populate it with the JSON data
        // const openingDictionary = new Dictionary();   // Creating a new Dictionary instance

        // Transferring JSON data to Dictionary
        for (const key in jsonData) {
            if (Object.hasOwnProperty.call(jsonData, key)) {
            this.dictionary.set(key, jsonData[key]);
            }
        }
    };

    initSearchInput() {
        const searchInput = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('results');

        searchInput.addEventListener('input', () => {
            let results = [];
            const query = searchInput.value.toLowerCase().trim();
            results = this.dictionary.getEntriesFromAttributes("NAME", query)
            this.displayResults(results, resultsContainer);
        });
    };


    displayResults(results, container) {
        console.log("displayResults")
        container.innerHTML = '';
        if (results.length === 0) {
            container.innerHTML = '<li>No results found</li>';
            return;
        }
        results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = `${result.PGN}: ${result.NAME}`;
            container.appendChild(li);
        });
        // Generate chessboards from the RESULTS
        this.clearAllBoards();
        this.loadChessBoards(results);
    };


    /**
     * Loads chess boards.
     * @param {Object} openings The openings to load.
     */
    loadChessBoards(openings) {
        const parentEL = document.body.querySelector("#side-board-containers");
        let index = 1;
        for (const key in openings) {
            if (openings.hasOwnProperty(key)) {
                const opening = openings[key];
                const newGame = new Game(opening, index, parentEL);
                newGame.initGame();

                // Use arrow function to maintain "this" context and bind index value
                document.querySelector(`#chessboard-container${index}`).addEventListener('click', ((index) => {
                    return (event) => {
                        this.handleBoardClick(event, index-1);
                    };
                })(index));

                this.sideGameBoards.push({ index, game: newGame });
                index++;
            }
        }
    };


    /**
     * Action to take when anything in the Game() object is clicked
     */
    handleBoardClick(event, index) {
        const boardClicked = this.sideGameBoards[index].game;
        this.updateMainBoard(boardClicked.information)
    };


    /**
     * Clears all boards.
     */
    clearAllBoards() {
        const constSideboard = document.body.querySelector("#side-board-containers");
        while (constSideboard.firstChild) {
            constSideboard.removeChild(constSideboard.firstChild);
            this.sideGameBoards.pop();
        }
    };
};

export default FrontPage;
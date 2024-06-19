// import { Game, GameLarge, GameSmall} from "./GameUsingLogic.js";
import { Game, GameLarge, GameSmall} from "./GameUsingFEN.js";
import JSONReader from "./JSONReader.js";
import {Dictionary, ChessDictionary} from "./Dictionary.js";

// import StaticChessUtility from "./StaticChessUtility.js";

import CommandManager from "../command/CommandManager.js";
import SearchCommand from "../command/SearchCommand.js";



class FrontPageUsingFEN {
    #className;         // Name of this class
    #mainGame;          // Main interactive chessboard that user can modify
    #sideGames;         // List of generated openings
    #dictionary;        // Key/Value dictionary of chess openings, and the details of their openings
    #searchTimeout;     //
    #parentELMain;      // DOM element of the left half of the board. Displays the interactive board (GameLarge)
    #parentELSide;      // Dom element of the right half of the board. Displays the multiple display boards (GameSmall)
    #overlayButton;     // Button that activates the overlay - may not be active
    #btnDebug;          // Debug button
    #formData;          // Form class - I'm not sure if used
    #commandManager;    // Command manager for executing commands

    constructor() {
        // console.log("Func: START constructor (FrontPage)")
        this.#className = "FrontPage";
        this.#mainGame = null;
        this.#sideGames = [];
        this.#dictionary = new ChessDictionary();
        this.#searchTimeout = null;
        this.#parentELMain = document.querySelector("#main-board-container");
        this.#parentELSide = document.querySelector("#side-board-container");
        this.#overlayButton = document.getElementById('popUpButton');
        this.#btnDebug = document.querySelector(`#btnDebug`)
        this.#formData = null
        this.#commandManager = new CommandManager();
        

        // this.commandManager = new CommandManager();
        this.init();
        // console.log("Func: END constructor (FrontPage)")
    };

    // Method to perform a search using the SearchCommand
    performSearch(category, searchWord) {
        const command = new SearchCommand(this, category, searchWord); // Create a new SearchCommand
        console.log(command)
        this.executeCommand(command); // Execute the command
    };

    executeCommand(command) {
        this.#commandManager.execute(command);
    };

    undoLastCommand() {
        this.#commandManager.undo();
    };

    redoLastUndoneCommand() {
        this.#commandManager.redo();
    };



    get className() {
        return this.#className;
    };
    get parentElementMain() {
        return this.#parentELMain;
    };
    get parentElementSide() {
        return this.#parentELSide;
    };
    get mainChessboardGame() {
        return this.#mainGame
    };
    set mainChessboardGame(value) {
        this.#mainGame = value
    };
    get sideChessboardList() {
        return this.#sideGames
    };
    set sideChessboardList(value) {
        this.#sideGames = value
    };
    get elementDebugButton() {
        return this.#btnDebug
    };
    get chessDictionary() {
        return this.#dictionary;
    };
    set chessDictionary(value) {
        this.#dictionary = value;
    };
    get formDataObject() {
        return this.#formData;
    };
    set formDataObject(value) {
        this.#formData = value;
    };
    returnLargeGame(index) {
        return this.mainChessboardGame;
    };
    returnSmallGame(index) {
        return this.sideChessboardList[index];
    };
    returnDictionaryEco(eco) {
        return this.chessDictionary.filterECO(eco)
    };
    returnAllPossibleMoves(moveNum, teamNum) {
        return this.chessDictionary.filterPossibleMoves(moveNum-1, teamNum);
    };
    clearMainBoard() {
        this.mainChessboardGame = null;
        this.parentElementMain.innerHTML = '';    
    };
    clearSideBoards() {
        this.sideChessboardList = []
        this.parentElementSide.innerHTML = '';   
    };
    clickEvent_Debugging() {
        console.log(this.sideChessboardList[2])
        console.log(this.sideChessboardList[2].board.returnBoardAsString())
        // console.log("clickEvent_Debugging");

        // const root = document.documentElement;
        // // Toggle the data-style attribute on the root element
        // if (root.getAttribute('data-style') === 'flipped') {
        //     root.removeAttribute('data-style');
        // } else {
        //     root.setAttribute('data-style', 'flipped');
        // }  
    };
    clickEvent_GameElement(event, index) {
        console.log("clickEvent_GameElement")
    };
    searchInDictionary(queryType, searchTerm) {
        return this.chessDictionary.getEntriesFromAttributes(queryType, searchTerm);
    };
    returnGameID(key) {
        return this.chessDictionary.get(key)["ID"]
    };
    clickEvent_SearchFilterButton(category, searchWord) {
        this.filterDictionary(category, searchWord)
        console.log(this.filterDictionary(category, searchWord))
    }


//******* Initialize the FrontPage and its dictionary *******
    async init() {
        // console.log("Func: START init (FrontPage)")

        // Create an instance of GameInteractive for the main board

        // This object here is bypass the "validateOpeningObject" error check
        const emptyOpening = { ID: null, FEN: "", ECO: "", VOLUME: "", NAME: "", PGN: "", MOVESSTRING: "", NUMTURNS: null, NEXTTOMOVE: "", FAMILY: "", CASTLINGBLACK: null, CASTLINGWHITE: null, CHECKMATE: false, COMMON: null, CONTINUATIONSFULL: [], CONTINUATIONSNEXT: [], FAVOURITE: null, ISERROR: null, MOVEOBJ: [], SUBVARIATION: null, VARIATION: null };

        // this.mainGame = new GameLarge(emptyOpening, 0, this.#parentELMain, this.callback_onStoredPGNChange.bind(this));
        // this.mainGame.render()

        this.mainGame = new GameLarge(emptyOpening, 0, this.#parentELMain, this.callback_onStoredFENchange.bind(this));
        this.mainGame.render()

        // Create the "database" of all the openings
        await this.initDictionary();

        clearTimeout(this.#searchTimeout);      // Stop all the setup async functions
        this.elementDebugButton.addEventListener('click', (event) => {
            this.clickEvent_Debugging()
        })

        console.log(`--------------`)
        // Example usage: COMMAND PATTERN EXAMPLE Perform a search when initializing 
        const a = this.performSearch("NAME", "Sicilian Defense");
        console.log(a)


        document.getElementById("searchButton").addEventListener("click", (event) => {
            const category = document.getElementById("filter-drop-down").value;
            const searchWord = document.getElementById("searchText").value;
            
            // Call the filterDictionary function with selected category and search text
            this.clickEvent_SearchFilterButton(category, searchWord);
            
        });


        // Test multi dictionary search
        const search1 = this.chessDictionary.filterECO("C45")
        console.log(search1)

    };


//******* Convert JSON file into a javascript object *******
    async readJSONFile(filePath) {
        const jsonReader = new JSONReader(filePath);
        return await jsonReader.readJSON();
    };




    /**
     * Prepares the dictionary object of all chess openings
     */
    async initDictionary() {
        const filepath = './data/openings_data.json';

        // Find the JSON file and read the data
        const jsonData = await this.readJSONFile(filepath);

        // Go through each JSON item and add it to the Dictionary() class
        Object.entries(jsonData).forEach(([key, value]) => this.#dictionary.set(key, value));
    };





    /**
     * Function that runs when the GameLarge() changes
     * 
     * @param {string} fen The FEN of the game
     */
    callback_onStoredFENchange(fen) {
        console.log(" FUNCTION: callback_onStoredFENchange") 

        this.clearSideBoards();


        const id = this.returnGameID(fen)

        const openings = this.chessDictionary.filterContinuationsNext(id)

        // Define a function to create a chessboard asynchronously
        const createChessboardAsync = async (opening, index) => {
            const sideChessboard = new GameSmall(opening, index + 1, this.#parentELSide, opening.FEN);
            this.sideChessboardList.push(sideChessboard);
            await sideChessboard.updateGameInformation(opening);
            sideChessboard.render();
        };

        // Run the creation of each chessboard asynchronously
        const creationPromises = openings.map((opening, index) => createChessboardAsync(opening, index));

        // Wait for all chessboards to be created before attaching event listeners
        Promise.all(creationPromises)
            .then(() => {
                this.attachEventListenersToSideBoards();
            })
            .catch(error => {
                console.error("Error creating chessboards:", error);
            });
    };


    /**
     * When each of the GameSmall() is clicked, run this function
     */
    attachEventListenersToSideBoards() {
        this.sideChessboardList.forEach((gameObj, index) => {
            gameObj.element.addEventListener('click', (event) => {
                this.clickEvent_GameElement(event, index);         
            });
        });
    };


//******* Chess opening dictionary, filter/search function *******

    /**
     * Chess opening dictionary, filter/search function
     * 
     * @param {String} category Dictionary key (Ie: "ECO", "FAMILY", "PGN")
     * @param {String} searchWord Dictionary value to be filtered by
     * @returns {Array} List of filtered dictionary openings
     */
    filterDictionary(category, searchWord) {
        let result = {};
        switch (category.toUpperCase()) {
            case "ECO":
                result = this.#dictionary.filterECO(searchWord)
                break
            case "NAME":
                result = this.#dictionary.filterName(searchWord)
                break;
            case "FAMILY":
                result = this.#dictionary.filterFamily(searchWord)
                break;
            case "VARIATION":
                result = this.#dictionary.filterVariation(searchWord)
                break;
            case "SUBVARIATION":
                result = this.#dictionary.filterSubVariation(searchWord)
                break;
            case "NEXTTOMOVE":
                result = this.#dictionary.filterNextMove(searchWord)
                break;
            case "PGN":
                result = this.#dictionary.filterPGN(searchWord)
                break;
            case "OVER":
                result = this.#dictionary.filterNUMTURNSOver(searchWord)
                break;
            case "UNDER":
                result = this.#dictionary.filterNUMTURNSUnder(searchWord)
                break;
            case "NUMTURNS":
                result = this.#dictionary.filterNextMove(searchWord)
                break;
            default:
                throw new Error(`Search category: ${category} is not a valid search term`);
        }
        return result;
    };
};


export default FrontPageUsingFEN;
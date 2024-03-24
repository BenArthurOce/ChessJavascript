import { Game, GameLarge, GameSmall} from "./Game.js";
import JSONReader from "./JSONReader.js";
import {Dictionary, ChessDictionary} from "./Dictionary.js";



class FrontPage {
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

    constructor() {
        // console.log("Func: START constructor (FrontPage)")
        this.#className = "Board";
        this.#mainGame = null;
        this.#sideGames = [];
        this.#dictionary = new ChessDictionary();
        this.#searchTimeout = null;
        this.#parentELMain = document.querySelector("#main-board-container");
        this.#parentELSide = document.querySelector("#side-board-container");
        this.#overlayButton = document.getElementById('popUpButton');
        this.#btnDebug = document.querySelector(`#btnDebug`)
        this.#formData = null

        this.init();
        // console.log("Func: END constructor (FrontPage)")
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
        console.log("clickEvent_Debugging");

        const root = document.documentElement;
    
        // Toggle the data-style attribute on the root element
        if (root.getAttribute('data-style') === 'flipped') {
            root.removeAttribute('data-style');
        } else {
            root.setAttribute('data-style', 'flipped');
        }  

    };
    clickEvent_GameElement(event, index) {
        console.log("clickEvent_GameElement")
    };
    searchInDictionary(queryType, searchTerm) {
        return this.chessDictionary.getEntriesFromAttributes(queryType, searchTerm);
    };


//******* Initialize the FrontPage and its dictionary *******
    async init() {
        // console.log("Func: START init (FrontPage)")

        // Create an instance of GameInteractive for the main board
        this.mainGame = new GameLarge(null, 0, this.#parentELMain, this.callback_onStoredPGNChange.bind(this));
        this.mainGame.render()

        // Create the "database" of all the openings
        await this.initDictionary();

        clearTimeout(this.#searchTimeout);      // Stop all the setup async functions
        this.elementDebugButton.addEventListener('click', (event) => {
            this.clickEvent_Debugging()
        })
    };


//******* Convert JSON file into a javascript object *******
    async readJSONFile(filePath) {
        const jsonReader = new JSONReader(filePath);
        return await jsonReader.readJSON();
    };


//******* Prepare the chess opening dictionary *******
    async initDictionary() {
        const filepath = './data/newChessOpenings.json';

        // Find the JSON file and read the data
        const jsonData = await this.readJSONFile(filepath);

        // Go through each JSON item and add it to the Dictionary() class
        Object.entries(jsonData).forEach(([key, value]) => this.#dictionary.set(key, value));

        // In the Dictionary() Object, parse "MOVESTRING" into "MOVEOBJ"
        this.#dictionary.updateWithMoveObj();
    };


//******* Function that runs when the GameLarge() changes *******
    callback_onStoredPGNChange(newPGN) {
        this.clearSideBoards();
        const openings = this.filterDictionary("PGN", newPGN);

        // Define a function to create a chessboard asynchronously
        const createChessboardAsync = async (opening, index) => {
            const sideChessboard = new GameSmall(opening, index + 1, this.#parentELSide);
            this.sideChessboardList.push(sideChessboard);
            await sideChessboard.updateGameInformation(opening);
            await sideChessboard.runGameWithParserObject();
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

            this.upcomingMoves()
    };



//******* When each of the GameSmall() is clicked, run this function *******
    attachEventListenersToSideBoards() {
        this.sideChessboardList.forEach((gameObj, index) => {
            gameObj.element.addEventListener('click', (event) => {
                this.clickEvent_GameElement(event, index);         
            });
        });
    };


//******* Chess opening dictionary, filter/search function *******
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
                result = this.#dictionary.filterNumMovesOver(searchWord)
                break;
            case "UNDER":
                result = this.#dictionary.filterNumMovesUnder(searchWord)
                break;
            case "NUMMOVES":
                result = this.#dictionary.filterNextMove(searchWord)
                break;
            default:
                throw new Error(`Search category: ${category} is not a valid search term`);
        }
        return result;
    };

    upcomingMoves() {
        console.log("makeButtons")

        console.log(this.chessDictionary.values())

        const results = this.#dictionary.filterPossibleMoves(1,1)
        console.log(results)

    };
    


};


export default FrontPage;
import { Game, GameLarge, GameSmall} from "./Game.js";
import JSONReader from "./JSONReader.js";
import {Dictionary, ChessDictionary} from "./Dictionary.js";



class FrontPage {
    #className = "Board";
    #mainGame = null;
    #sideGames = [];
    #dictionary = new ChessDictionary();
    #searchTimeout = null;
    #parentELMain = document.querySelector("#main-board-container");
    #parentELSide = document.querySelector("#side-board-container");
    #overlayButton = document.getElementById('popUpButton');
    #btnDebug = document.querySelector(`#btnDebug`)
    #formData = null

    constructor() {
        // console.log("Func: START constructor (FrontPage)")
        this.init();
        // console.log("Func: END constructor (FrontPage)")
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
        return this.#dictionary = value;
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
        console.log("clickEvent_Debugging")
    };
    clickEvent_GameElement(event, index) {
        console.log("clickEvent_GameElement")
    };
    searchInDictionary(queryType, searchTerm) {
        return this.chessDictionary.getEntriesFromAttributes(queryType, searchTerm);
    };
    
    /// *******  Init Functions ******* //
    async init() {
        // console.log("Func: START init (FrontPage)")

        // Create an instance of GameInteractive for the main board
        this.mainGame = new GameLarge(null, 0, this.#parentELMain);
        this.mainGame.render()

        // Register callback to be notified of changes to storedPGN
        this.mainGame.registerOnStoredPGNChangeCallback(this.callback_onStoredPGNChange.bind(this));

        // Create the "database" of all the openings
        await this.initDictionary();

        clearTimeout(this.#searchTimeout);      // Stop all the setup async functions
        this.elementDebugButton.addEventListener('click', (event) => {
            this.clickEvent_Debugging()
        })
    };

    async initDictionary() {
        const filepath = './data/newChessOpenings.json'

        // Find the JSON file and read the data
        const jsonData = await this.readJSONFile(filepath);

        // Go through each JSON item and add it to the Dictionary() class
        Object.entries(jsonData).forEach(([key, value]) => this.#dictionary.set(key, value));

        // In the Dictionary() Object, parse "MOVESTRING" into "MOVEOBJ"
        this.#dictionary.updateWithMoveObj();
    };

    async readJSONFile(filePath) {
        const jsonReader = new JSONReader(filePath);
        await jsonReader.readJSONSync();
        return jsonReader.getData();
    };


    attachEventListenersToSideBoards() {
        this.sideChessboardList.forEach((gameObj, index) => {
            gameObj.element.addEventListener('click', (event) => {
                this.clickEvent_GameElement(event, index);         
            });
        });
    };


    // Callback function to handle changes to storedPGN
    callback_onStoredPGNChange(newPGN) {
        this.clearSideBoards()
        const openings = this.filterDictionary("PGN", newPGN)
        openings.forEach((opening, index) => {
            this.sideChessboardList.push(new GameSmall(opening, index+1, this.#parentELSide))
            this.sideChessboardList[index].updateGameInformation(opening)
            this.sideChessboardList[index].runGameWithParserObject()
            this.sideChessboardList[index].addInfoToElement(opening)
            this.sideChessboardList[index].render()
        });

        this.attachEventListenersToSideBoards()
    };


    // Calling different openings in the dictionary
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


};


export default FrontPage;

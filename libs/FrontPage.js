// import { Game, GameLarge, GameSmall} from "./GameUsingFEN.js";
import JSONReader from "./JSONReader.js";
import {Dictionary, ChessDictionary} from "./Dictionary.js";

import { Game, GameLarge, GameSmall} from "./Game.js";

import GameLogCommand from "../commandOLD/GameLogCommand.js";
import CommandManager from "../commandOLD/CommandManager.js";
import SearchCommand from "../commandOLD/SearchCommand.js";
import GenerateSideboardsCommand from "../commandOLD/GenerateSideBoardsCommand.js";

// import GenerateSideboardsCommand from "../command/GenerateSideBoardsCommand.js";

class FrontPage {
    #className;         // Name of this class
    #mainGame;          // Main interactive chessboard that user can modify
    #sideGames;         // List of generated openings
    #dictionary;        // Key/Value dictionary of chess openings, and the details of their openings
    #searchTimeout;     //
    #parentELMain;      // DOM element of the left half of the board. Displays the interactive board (GameLarge)
    #parentELSide;      // Dom element of the right half of the board. Displays the multiple display boards (GameSmall)
    #overlayButton;     // Button that activates the overlay - may not be active
    #btnDebug1;          // Debug button
    #btnDebug2;          // Debug button
    #btnDebug3;          // Debug button
    #btnDebug4;          // Debug button
    #btnDebug5;          // Debug button
    #btnDebug6;          // Debug button

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
        this.#btnDebug1 = document.querySelector(`#btnDebug1`)
        this.#btnDebug2 = document.querySelector(`#btnDebug2`)
        this.#btnDebug3 = document.querySelector(`#btnDebug3`)
        this.#btnDebug4 = document.querySelector(`#btnDebug4`)
        this.#btnDebug5 = document.querySelector(`#btnDebug5`)
        this.#btnDebug6 = document.querySelector(`#btnDebug6`)

        this.#commandManager = new CommandManager();

        this.#btnDebug1.addEventListener('click', (event) => {
            this.clickEvent_Debugging1()
        })

        this.#btnDebug2.addEventListener('click', (event) => {
            this.clickEvent_Debugging2()
        })

        // this.#btnDebug3.addEventListener('click', (event) => {
        //     this.clickEvent_Debugging3()
        // })

        // this.#btnDebug4.addEventListener('click', (event) => {
        //     this.clickEvent_Debugging4()
        // })

        this.#btnDebug5.addEventListener('click', (event) => {
            this.clickEvent_Debugging5()
        })

        this.#btnDebug6.addEventListener('click', (event) => {
            this.clickEvent_Debugging6()
        })
        
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
        return this.#btnDebug1
    };
    get chessDictionary() {
        return this.#dictionary;
    };
    set chessDictionary(value) {
        this.#dictionary = value;
    };

    get btnDebug1() {
        return this.#btnDebug1;
    };
    get btnDebug2() {
        return this.#btnDebug2;
    };
    get btnDebug3() {
        return this.#btnDebug3;
    };
    get btnDebug4() {
        return this.#btnDebug4;
    };
    get btnDebug5() {
        return this.#btnDebug5;
    };
    get btnDebug6() {
        return this.#btnDebug6;
    };


    executeCommand(command) {
        this.#commandManager.execute(command);
    }

    undoLastCommand() {
        this.#commandManager.undo();
    }

    redoLastUndoneCommand() {
        this.#commandManager.redo();
    }

    returnMainGameID(key) {
        return this.chessDictionary.get(key)["ID"]
    };


    callback_onStoredFENchange(fen) {
        console.log("FEN has been updated:", fen);
        // Additional logic to handle the FEN change
    };

    createMainBoard(fen) {
        console.log(`\tFunc: createMainBoard (FrontPage)`);
        const opening = this.chessDictionary.get(fen);
        this.mainGame = new GameLarge(opening, 0, this.parentElementMain, this.callback_onStoredFENchange.bind(this));
        this.mainGame.render();

        const id = this.returnMainGameID(fen);
        const openings = this.chessDictionary.filterContinuationsNext(id);

        const createChessboardAsync = async (opening, index) => {
            const sideChessboard = new GameSmall(opening, index + 1, this.parentElementSide, opening.FEN);
            this.sideChessboardList.push(sideChessboard);
            await sideChessboard.updateGameInformation(opening);
            sideChessboard.render();
        };

        // const creationPromises = openings.map((opening, index) => createChessboardAsync(opening, index));

        // Promise.all(creationPromises)
        //     .then(() => {
        //         this.attachEventListenersToSideBoards();
        //     })
        //     .catch(error => {
        //         console.error("Error creating chessboards:", error);
        //     });
    };

    clearMainBoard() {
        this.mainChessboardGame = null;
        this.parentElementMain.innerHTML = '';    
    };

    clearSideBoards() {
        this.sideChessboardList = []
        this.parentElementSide.innerHTML = '';   
    };

    clickEvent_Debugging1() {
        console.log("clickEvent_Debugging1 (FrontPage)");

        // Use GameLogCommand
        // const logCommand = new GameLogCommand(`Stored FEN updated to: ${this.#storedFEN}`);
        const logCommand = new GameLogCommand(`Stored FEN updated to: ${this.#className}`);
        logCommand.execute();

        const a = this.performSearch("NAME", "Sicilian Defense");

        

    };

    clickEvent_Debugging2() {
        console.log("clickEvent_Debugging2 (FrontPage)");

        // const test_openings = this.performSearch("NAME", "Sicilian Defense");

        // const test_openings = this.performSearch("NAME", "Sicilian Defense");
        const dictResults = this.chessDictionary.filterECO("C45")
        const b = this.invokeGenerateSideBoardsCommand(dictResults)
    };

    clickEvent_Debugging3() {
        console.log("clickEvent_Debugging3 (FrontPage)");
    };

    clickEvent_Debugging4() {
        console.log("clickEvent_Debugging4 (FrontPage)");
    };

    clickEvent_Debugging5() {
        console.log("clickEvent_Debugging5 (FrontPage)");
    };

    clickEvent_Debugging6() {
        console.log("clickEvent_Debugging6 (FrontPage)");
    };



    performSearch(category, searchWord) {
        const command = new SearchCommand(this, category, searchWord); // Create a new SearchCommand
        console.log(command)
        this.executeCommand(command); // Execute the command
    };


    invokeGenerateSideBoardsCommand(arrayOpeningObjects) {

        // console.log(arrayOpeningObjects)
        const command = new GenerateSideboardsCommand(this, arrayOpeningObjects, this.#parentELSide)
        this.executeCommand(command); // Execute the command
    };



    clickEvent_SearchFilterButton(category, searchWord) {
        console.log("clickEvent_SearchFilterButton (FrontPage)")
        this.filterDictionary(category, searchWord)
        console.log(this.filterDictionary(category, searchWord))
    };




    /**
     * Initialize the FrontPage and its dictionary
     */
    async init() {
        console.log(`\tFunc: START init (FrontPage)`);

        // Create the "database" of all the openings
        await this.initDictionary();

        // Stop all the setup async functions
        clearTimeout(this.#searchTimeout);

        // Add Event listeners
        document.getElementById("searchButton").addEventListener("click", (event) => {
            const category = document.getElementById("filter-drop-down").value;
            const searchWord = document.getElementById("searchText").value;
            
            // Call the filterDictionary function with selected category and search text
            this.clickEvent_SearchFilterButton(category, searchWord);
    


            // this.elementDebugButton.addEventListener('click', (event) => {
            //     this.clickEvent_Debugging()
            // })
        
        });

        const empty_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
        this.createMainBoard(empty_fen)

        console.log(`\tFunc: END init (FrontPage)`);
    };


    /**
     * Convert JSON file into a javascript object
     */
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


    // /**
    //  * Function that runs when the GameLarge() changes
    //  * 
    //  * @param {string} fen The FEN of the game
    //  */
    // callback_onStoredFENchange(fen) {
    //     console.log(" FUNCTION: callback_onStoredFENchange") 


        
    //     this.clearSideBoards();


    //     const id = this.returnGameID(fen)

    //     const openings = this.chessDictionary.filterContinuationsNext(id)

    //     this.clearMainBoard()

    //     const emptyOpening = { ID: null, FEN: "", ECO: "", VOLUME: "", NAME: "", PGN: "", MOVESSTRING: "", NUMTURNS: null, NEXTTOMOVE: "", FAMILY: "", CASTLINGBLACK: null, CASTLINGWHITE: null, CHECKMATE: false, COMMON: null, CONTINUATIONSFULL: [], CONTINUATIONSNEXT: [], FAVOURITE: null, ISERROR: null, MOVEOBJ: [], SUBVARIATION: null, VARIATION: null };
    //     // this.createMainBoard(emptyOpening)

    //     // console.log("---------")
    //     // console.log(fen)
    //     // console.log("---------")
    //     this.createMainBoard(fen)

    //     // Define a function to create a chessboard asynchronously
    //     const createChessboardAsync = async (opening, index) => {
    //         const sideChessboard = new GameSmall(opening, index + 1, this.#parentELSide, opening.FEN);
    //         this.sideChessboardList.push(sideChessboard);
    //         await sideChessboard.updateGameInformation(opening);
    //         sideChessboard.render();
    //     };

    //     // Run the creation of each chessboard asynchronously
    //     const creationPromises = openings.map((opening, index) => createChessboardAsync(opening, index));

    //     // Wait for all chessboards to be created before attaching event listeners
    //     Promise.all(creationPromises)
    //         .then(() => {
    //             this.attachEventListenersToSideBoards();
    //         })
    //         .catch(error => {
    //             console.error("Error creating chessboards:", error);
    //         });
    // };


    /**
     * When each of the GameSmall() is clicked, run this function
     */
    // attachEventListenersToSideBoards() {
    //     this.sideChessboardList.forEach((gameObj, index) => {
    //         gameObj.element.addEventListener('click', (event) => {
    //             this.clickEvent_GameElement(event, index);         
    //         });
    //     });
    // };


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



    clickEvent_GameElement(event, index) {
        console.log("clickEvent_GameElement (FrontPage)")
        console.log(index)
    };

};


export default FrontPage;
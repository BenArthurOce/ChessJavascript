// import Overlay from "./Overlay.js";
// import Caller from "./Overlay.js";
import { Game, GameTest, GameInteractive } from "./Game.js";
// import Game from "./Game.js";
import JSONReader from "./JSONReader.js";
import {Dictionary, ChessDictionary} from "./Dictionary.js";

import {Form, Popup} from "./Form.js"; 
import { BoardInteractive } from "./Board.js";


// UI ideas
// Dialog Box
// Move that occured on move x / capture that occured on move x


class FrontPage {
    #className = "Board";
    #mainGame = null;
    #sideGames = [];
    #dictionary = new ChessDictionary();
    #searchTimeout = null;
    #parentELMain = document.querySelector("#main-board-container");
    #parentELSide = document.querySelector("#side-board-container");

    #searchInput = document.getElementById('searchInput');
    #searchInputPGN = document.getElementById('searchInputPGN');

    #searchInputCapture = document.querySelector(`#searchInputCapture`)

    #overlayButton = document.getElementById('popUpButton');

    #allOneMovePGN = null
    #allTwoMovePGN = null
    #allThreeMovePGN = null


    #formData = null


    constructor() {
        console.log("Func: START constructor (FrontPage)")
        this.init();
        console.log("Func: END constructor (FrontPage)")
    };

    get className() {
        return this.#className;
    };
    set className(value) {
        this.#className = value;
    };
    get mainGame() {
        return this.#mainGame;
    };
    set mainGame(value) {
        this.#mainGame = value;
    };
    get parentELMain() {
        return this.#parentELMain;
    };
    get parentELSide() {
        return this.#parentELSide;
    };
    get sideGames() {
        return this.#sideGames;
    };
    set sideGames(value) {
        this.#sideGames = value;
    };
    // get elements() {
    //     return this.#elements;
    // };
    // get allTwoMoveContinuations() {
    //     return this.#allTwoMoveContinuations;
    // };
    // set allTwoMoveContinuations(value) {
    //     this.#allTwoMoveContinuations = value;
    // };
    // get allThreeMoveContinuations() {
    //     return this.#allThreeMoveContinuations;
    // };
    // set allThreeMoveContinuations(value) {
    //     this.#allThreeMoveContinuations = value;
    // };
    get dictionary() {
        return this.#dictionary;
    };
    set dictionary(value) {
        this.#dictionary = value;
    };

    get formDataObject() {
        return this.#formData;
    };
    set formDataObject(value) {
        this.#formData = value;
    };

    ////////////////////////////////////////////////////
    ////////////// --- Init Functions --- //////////////
    ////////////////////////////////////////////////////


    async init() {
        console.log("Func: START init (FrontPage)")
        // await this.initMainBoard();             // Create the main chessboard




        this.#mainGame = new GameInteractive(null, 0, this.#parentELMain)
        this.#mainGame.init()
        await this.initDictionary();            // Create the "database" of all the openings

        clearTimeout(this.#searchTimeout);      // Stop all the setup async functions
        this.initSearchInput();                 // Sets up the UI (Needs to be removed)
        this.initEventListeners()               // To be filled

        this.initDropDownBoxes()



        console.log("Func: END init (FrontPage)")

        // twoMovesDropdown
        // threeMovesDropdown
    };


    async initMainBoard() {
        console.log(`Func: initMainBoard \n--------------------`)
        // this.#mainGame = this.#createGame(null, 0, this.#parentELMain)
        this.#mainGame = new GameInteractive(null, 0, this.#parentELMain)   
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

    
    initDropDownBoxes() {

        const oneMovers = this.#dictionary.filterNumMovesBetween(1, 1)
        this.#allOneMovePGN = oneMovers.map(({ PGN }) => PGN);

        const twoMovers = this.#dictionary.filterNumMovesBetween(2, 2)
        this.#allTwoMovePGN = twoMovers.map(({ PGN }) => PGN);

        const threeMovers = this.#dictionary.filterNumMovesBetween(3, 3)
        this.#allThreeMovePGN = threeMovers.map(({ PGN }) => PGN);

        // Access radio buttons and dropdown divs
        const oneMovesRadio = document.getElementById("oneMovesRadio");
        const twoMovesRadio = document.getElementById("twoMovesRadio");
        const threeMovesRadio = document.getElementById("threeMovesRadio");
        const oneMovesDropdownSelect = document.getElementById("oneMovesDropdownSelect");
        const twoMovesDropdownSelect = document.getElementById("twoMovesDropdownSelect");
        const threeMovesDropdownSelect = document.getElementById("threeMovesDropdownSelect");


        // Event listener for radio buttons
        oneMovesRadio.addEventListener("change", () => {
            if (oneMovesRadio.checked) {
                showDropdown(oneMovesDropdown);
                hideDropdown(twoMovesDropdown);
                hideDropdown(threeMovesDropdown);
                populateDropdown("oneMovesDropdownSelect", this.#allOneMovePGN);
            }
        });

        twoMovesRadio.addEventListener("change", () => {
            if (twoMovesRadio.checked) {
                hideDropdown(oneMovesDropdown);
                showDropdown(twoMovesDropdown);
                hideDropdown(threeMovesDropdown);
                populateDropdown("twoMovesDropdownSelect", this.#allTwoMovePGN);
            }
        });

        threeMovesRadio.addEventListener("change", () => {
            if (threeMovesRadio.checked) {
                hideDropdown(oneMovesDropdown);
                hideDropdown(twoMovesDropdown);
                showDropdown(threeMovesDropdown);
                populateDropdown("threeMovesDropdownSelect", this.#allThreeMovePGN);
            }
        });

        // Function to show dropdown
        function showDropdown(dropdown) {
            dropdown.style.display = "block";
        }

        // Function to hide dropdown
        function hideDropdown(dropdown) {
            dropdown.style.display = "none";
        }

        // Function to populate dropdown
        function populateDropdown(dropdownId, optionsArray) {
            const dropdown = document.getElementById(dropdownId);
            dropdown.innerHTML = ""; // Clear existing options

            // Sort the options array alphabetically
            optionsArray.sort();

            // Iterate through the sorted array and populate options
            optionsArray.forEach(optionText => {
                // Create an option element
                const option = document.createElement("option");
                // Set the text content of the option
                option.textContent = optionText;
                // Append the option to the select element
                dropdown.appendChild(option);
            });
        }



        // const twoMovesDropdown = document.getElementById("twoMovesDropdown");

        // console.log(twoMovesDropdown); // Just for debugging to ensure you're getting the correct element


        oneMovesDropdownSelect.addEventListener("change", () => {
            const selectedOption = oneMovesDropdownSelect.options[oneMovesDropdownSelect.selectedIndex].value;
            this.handleDropDownBoxChange(selectedOption)
            // console.log(selectedOption);
        });
        
        
        twoMovesDropdownSelect.addEventListener("change", () => {
            const selectedOption = twoMovesDropdownSelect.options[twoMovesDropdownSelect.selectedIndex].value;
            this.handleDropDownBoxChange(selectedOption)
            // console.log(selectedOption);
        });
        

        threeMovesDropdownSelect.addEventListener("change", () => {
            const selectedOption = threeMovesDropdownSelect.options[threeMovesDropdownSelect.selectedIndex].value;
            this.handleDropDownBoxChange(selectedOption)
            // console.log(selectedOption);
        });
        
};


    handleDropDownBoxChange(pgn) {
        const searchResults = this.#dictionary.filterPGN(pgn)
        this.#clearSideBoards();
        this.#updateSideBoards(searchResults);
    }


    ////////////// --- xxxxxxx --- //////////////


    initEventListeners() {
        this.#searchInputPGN.addEventListener('input', () => {
            console.log(`#searchInputPGN.`)
        });
        this.#searchInput.addEventListener('input', () => {
            console.log(`#searchInput.`)
        });
        this.#searchInputCapture.addEventListener('input', () => {
            console.log(`#searchInputCapture.`)
        });
        this.#overlayButton.addEventListener('click', () => {
            console.log(`#overlayButton.`)
        });
    };

    // searchInputCapture

    ////////////// ------------------- //////////////
    ////////////// --- FORM SEARCH --- //////////////
    ////////////// ------------------- //////////////

    handleOverlayPopup() {
        this.printSeperator();
        this.formDataObject = null; // Reset formDataObject
        
        const newForm = new Form();
        newForm.eventMethod(this.updateFormData.bind(this));
    };


    updateFormData(formData) {
        this.formDataObject = formData; // Update formDataObject
        this.receiveFormData(); // Call receiveFormData after updating formDataObject
    };


    receiveFormData() {
        console.log(`Func: receiveFormData || formData=`);
        console.log(this.formDataObject);

        const searchResult = this.performSearch(this.formDataObject);
        console.log(searchResult);

        this.#clearSideBoards();
        this.#updateSideBoards(searchResult);
    };


    performSearch(formData) {

        // console.log(formData)
        let searchResults
        if (formData.eco) {
            searchResults = this.#dictionary.filterECO(formData.eco)
            return searchResults
        }

        if (formData.name) {
            searchResults = this.#dictionary.filterName(formData.name)
            return searchResults
        }

        if (formData.family) {
            searchResults = this.#dictionary.filterFamily(formData.family)
            return searchResults
        }

        if (formData.variation) {
            searchResults = this.#dictionary.filterVariation(formData.variation)
            return searchResults
        }

        if (formData.nextMove) {
            searchResults = this.#dictionary.filterNextMove(formData.nextMove)
            return searchResults
        }

        if (formData.pgn) {
            searchResults = this.#dictionary.filterPGN(formData.pgn)
            return searchResults
        }

        if (formData.numMoves) {
            searchResults = this.#dictionary.filterNumMovesOver(formData.numMoves)
            return searchResults
        }

        if (formData.captureSquare && formData.captureTurn) {
            searchResults = this.#dictionary.filterCaptureOnSquare(formData.captureSquare, formData.captureTurn)
            return searchResults
        }

    };



    initSearchInput() {
        // console.log(`Func: initSearchInput`)


        const button = document.getElementById('popUpButton');
        button.addEventListener('click', () => this.handleOverlayPopup());

        const resultsContainer = document.getElementById('results');

        // const searchInput = document.getElementById('searchInput');

        searchInput.addEventListener('input', () => {

            // this.#handleInputEvent()


            // The main chessboard is cleared of all its pieces
            this.#returnGame(0).resetGame();

            // The sideboards are cleared out
            this.#clearSideBoards()

            // The dictionary returns a list of games based on the search input
            const searchResults = this.#searchInDictionary("NAME", this.#readSearchBox())

            // The sideboards generated depending on the search results
            this.#updateSideBoards(searchResults)


            clearTimeout(this.#searchTimeout);
            // this.searchCommandActivated()

            // // const a = this.#returnGame(0)
            // // console.log(a)
            // this.#clearMainBoard()
            // this.#searchTimeout = setTimeout(() => {
            //     // console.log(this.#returnGame(3))
            //     const query = searchInput.value.toLowerCase().trim();
            //     // const results = this.#dictionary.getEntriesFromAttributes("NAME", query);

            //     const results = this.searchInDictionary("NAME", query)
            //     this.handleSearchInput(results, resultsContainer);
            // }, 500); // Time delay / Debounce
        });

        this.#searchInputPGN.addEventListener('input', () => {

            // The main chessboard is cleared of all its pieces
            this.#returnGame(0).resetGame();

            // The sideboards are cleared out
            this.#clearSideBoards()

            const searchResults = this.#searchInDictionary("PGN", this.#readSearchBoxPGN())

            // The sideboards generated depending on the search results
            this.#updateSideBoards(searchResults)

            // this.#handleInputEvent()
            clearTimeout(this.#searchTimeout);

        });


    };


    #handleGameClickEvent(event, index) {
        console.log(`Func: #handleBoardClick  | event=${event} | index=${index}`)
        // This is when a chessboard is clicked

        // The main chessboard gets wiped
        this.#clearMainBoard()

        // We store the index of the chessboard that was clicked
        const clickedGame = this.#returnGame(index)
        // console.log(clickedGame)

        // The main Chessboard becomes that chessboard
        const newGame = this.#createGame(clickedGame.information, 0, this.#parentELMain)

        newGame.initGame();

        this.#mainGame = newGame

    };


    // Do not adjust.
    #readSearchBox() {
        return this.#searchInput.value.toLowerCase().trim();
    };

    #readSearchBoxPGN() {
        return this.#searchInputPGN.value.toLowerCase().trim();
    };

    #readSearchInputCapture() {
        return this.#searchInputCapture.value.toLowerCase().trim();
    };


    /**
     * xxx
     * 
     */
    #searchInDictionary(queryType, searchTerm) {
        console.log(`Func: searchInDictionary  | queryType=${queryType} | searchTerm=${searchTerm}`)
        return this.#dictionary.getEntriesFromAttributes(queryType, searchTerm);
    };


    /**
     * xxx
     * 
     */
    #clearMainBoard() {
        console.log(`Func: #clearMainBoard`)
        this.#mainGame = null;
        this.#parentELMain.innerHTML = '';
    };


    /**
     * xxx
     * 
     */
    #clearSideBoards() {
        console.log(`Func: #clearSideBoards`)
        this.sideGames = [];
        this.#parentELSide.innerHTML = '';
    };


    /**
     * xxx
     * 
     */
    #updateSideBoards(openings) {
        console.log(`Func: #updateSideBoards  | openings=ommitted`)
        openings.forEach((opening, index) => {
            this.#createGame(opening, index + 1, this.#parentELSide)
        });
    };



    #createGame(information, index, parentEl) {

        if (index ===  0 ) {

            // console.log(`Func: #createGame: |  information=${information}  |   index=${index}  |   parentEl=${parentEl}  |`)
        }
        
        let newGame;

        // Create Game() Object
        if (index === 0) {


            //ITS THIS LINE. THIS IS THE ISSUE.
            newGame = new GameInteractive(information, 0, parentEl);   // Create the Game


            
        }
        else if (index > 0) {
            newGame = new Game(information, index, parentEl);   // Create the Game
            // newGame.initGame();
            newGame.init()

            // Create click event
            newGame.element.addEventListener('click', (event) => {
                this.#handleGameClickEvent(event, index)
            })

            this.sideGames.push(newGame)
        }

        this.#mainGame = newGame;

        return newGame
    };
    


    #returnGame(index) {
        console.log(`Func: returnGame  | index=${index}`)
        if (typeof index !== 'number') {
            throw new Error(`index: ${index} is not a number. Game could not be returned`)
        }
        if (index===0) {return this.#mainGame}                            // 0 = Main game board
        index -=1   //Reduce index by 1 (to make it fit the base 0 requirements)
        return this.#sideGames[index]                                      // Otherwise side board
    };


    printSeperator() {
        console.log("//////////////////////")
        console.log("//////////////////////")
        console.log("//////////////////////")
    }
}

export default FrontPage;

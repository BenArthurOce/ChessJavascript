// import Overlay from "./Overlay.js";
// import Caller from "./Overlay.js";
// import { Game, GameDisplay, GameTest, GameInteractive } from "./Game.js";
import { Game, GameLarge, GameSmall} from "./Game.js";
// import Game from "./Game.js";
import JSONReader from "./JSONReader.js";
import {Dictionary, ChessDictionary} from "./Dictionary.js";

import {Form, Popup} from "./Form.js"; 
import { BoardInteractive } from "./Board.js";


// Game, GameDisplay, GameTest, GameInteractive


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

    #debugButton = document.querySelector(`#btnDebug`)
    // console.log(#debugButton)


    #allOneMovePGN = null
    #allTwoMovePGN = null
    #allThreeMovePGN = null


    #formData = null


    constructor() {
        // console.log("Func: START constructor (FrontPage)")
        this.init();
        // console.log("Func: END constructor (FrontPage)")
    };

    get debugButton() {
        return this.#debugButton;
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

    get mainParentElement() {
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

    // returnSmallGame(index) {
    //     return this.sideGames[index]
    // };
    





    // Big functions

    // Then small functions

    // init dictionary

    //Reset sideboards

    //clearing side board

    // clearing main board

    // clicking on a sideboard populates the main board

    //return sideboard from index


     

    // Callback function to handle changes to storedPGN
    callback_onStoredPGNChange(newPGN) {
        console.log("Stored PGN changed:", newPGN);
        // this.changeEvent_dropDownBox(newPGN)

        this.clearSideBoards()

        const openings = this.filterDictionary("PGN", newPGN)
        // this.testPopulateSideBoards()

        console.log(openings)
        openings.forEach((opening, index) => {
            this.sideGames.push(new GameSmall(opening, index+1, this.#parentELSide))
            this.sideGames[index].updateGameInformation(opening)
            this.sideGames[index].runGameWithParserObject()
            this.sideGames[index].addInfoToElement(opening)
            this.sideGames[index].render()
        });


        this.attachEventListenersToSideBoards()
        // Perform search or any other action here
    }


    ////////////////////////////////////////////////////
    ////////////// --- Init Functions --- //////////////
    ////////////////////////////////////////////////////


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
        // this.initSearchInput();                 // Sets up the UI (Needs to be removed)
        // this.initEventListeners()               // To be filled

        // this.initDropDownBoxes()
        // this.populateSideBoards()


        // Example functions of clearing and restoring new information
        // this.testClearAndPopulateMainGame()
        // this.testPopulateSideBoards()

        this.debugButton.addEventListener('click', (event) => {
            this.clickEvent_Debugging()

        })

        

    };



    // filterName(name) {
    //     return this.values().filter(({ NAME }) => NAME.includes(name));
    // };



    clickEvent_Debugging() {

    };

    // Example of a printing function
    // this.returnLargeGame().print()

    clearMainBoard() {
        this.mainGame = null;
        this.parentELMain.innerHTML = '';    
    };

    clearSideBoards() {
        this.sideGames = []
        this.parentELSide.innerHTML = '';   
    };


    testClearAndPopulateMainGame() {
        this.mainGame = null;
        this.parentELMain.innerHTML = '';

        const getECOResults = this.returnDictionaryEco("C45")
        const newGame = new GameLarge(null, 0, this.#parentELMain);
        newGame.updateGameInformation(getECOResults[2])
        const opening = getECOResults[2]

        console.log(opening)
        // newGame.updateGameInformation(opening)
        // newGame.runGameWithParserObject()
        // newGame.addInfoToElement(opening)
        // newGame.render()
        newGame.initAndRender(opening)

        // this.mainGame = newGame


        // this.mainGame = new GameLarge(a, 0, this.#parentELMain);
    }


    // testPopulateSideBoards() {
    //     const getECOResults = this.filterDictionary("ECO", "C45")
    //     // const getECOResults = this.returnDictionaryEco("C45")
    //     getECOResults.forEach((opening, index) => {
    //         this.sideGames.push(new GameSmall(opening, index+1, this.#parentELSide))
    //         this.sideGames[index].updateGameInformation(opening)
    //         this.sideGames[index].runGameWithParserObject()
    //         this.sideGames[index].addInfoToElement(opening)
    //         this.sideGames[index].render()
    //     })
    // };

    returnLargeGame(index) {
        return this.mainGame;
    };

    returnSmallGame(index) {
        return this.sideGames[index];
    };

    returnDictionaryEco(eco) {
        return this.dictionary.filterECO(eco)
    };

    returnAllPossibleMoves(moveNum, teamNum) {
        return this.dictionary.filterPossibleMoves(moveNum-1, teamNum);
    };

    attachEventListenersToSideBoards() {
        // this.sideGames.element.forEach((element, index) => {
        //     element.addEventListener('click', (event) => {
        //         this.clickEvent_GameElement(event, index);
        //     });
        // });

        this.sideGames.forEach((gameObj, index) => {
            gameObj.element.addEventListener('click', (event) => {
                this.clickEvent_GameElement(event, index);         
            });
        });
    };


    createSideBoards(array) {
        newGame = new Game(information, index, parentEl);   // Create the Game
        newGame.init()

        // Create click event
        newGame.element.addEventListener('click', (event) => {
            this.clickEvent_GameElement(event, index)
        })
    };



    /**
     * xxx
     * 
     */
    clearMainBoard() {
        console.log(`Func: #clearMainBoard`)
        this.#mainGame = null;
        this.#parentELMain.innerHTML = '';
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
        };

        oneMovesDropdownSelect.addEventListener("change", () => {
            const selectedOption = oneMovesDropdownSelect.options[oneMovesDropdownSelect.selectedIndex].value;
            this.changeEvent_dropDownBox(selectedOption)
        });
        
        twoMovesDropdownSelect.addEventListener("change", () => {
            const selectedOption = twoMovesDropdownSelect.options[twoMovesDropdownSelect.selectedIndex].value;
            this.changeEvent_dropDownBox(selectedOption)
        });
        
        threeMovesDropdownSelect.addEventListener("change", () => {
            const selectedOption = threeMovesDropdownSelect.options[threeMovesDropdownSelect.selectedIndex].value;
            this.changeEvent_dropDownBox(selectedOption)
        });  
    };



    changeEvent_dropDownBox(pgn) {
        const searchResults = this.#dictionary.filterPGN(pgn)
        this.#clearSideBoards();
        // this.#updateSideBoards(searchResults);
    };


    ////////////// --- xxxxxxx --- //////////////


    // initEventListeners() {
    //     this.#searchInputPGN.addEventListener('input', () => {
    //         console.log(`#searchInputPGN.`)
    //     });
    //     this.#searchInput.addEventListener('input', () => {
    //         console.log(`#searchInput.`)
    //     });
    //     this.#searchInputCapture.addEventListener('input', () => {
    //         console.log(`#searchInputCapture.`)
    //     });
    //     this.#overlayButton.addEventListener('click', () => {
    //         console.log(`#overlayButton.`)
    //     });
    // };

    // searchInputCapture



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



    // performSearch(formData) {

    //     // console.log(formData)
    //     let searchResults
    //     if (formData.eco) {
    //         searchResults = this.#dictionary.filterECO(formData.eco)
    //         return searchResults
    //     }

    //     if (formData.name) {
    //         searchResults = this.#dictionary.filterName(formData.name)
    //         return searchResults
    //     }

    //     if (formData.family) {
    //         searchResults = this.#dictionary.filterFamily(formData.family)
    //         return searchResults
    //     }

    //     if (formData.variation) {
    //         searchResults = this.#dictionary.filterVariation(formData.variation)
    //         return searchResults
    //     }

    //     if (formData.nextMove) {
    //         searchResults = this.#dictionary.filterNextMove(formData.nextMove)
    //         return searchResults
    //     }

    //     if (formData.pgn) {
    //         searchResults = this.#dictionary.filterPGN(formData.pgn)
    //         return searchResults
    //     }

    //     if (formData.numMoves) {
    //         searchResults = this.#dictionary.filterNumMovesOver(formData.numMoves)
    //         return searchResults
    //     }

    //     if (formData.captureSquare && formData.captureTurn) {
    //         searchResults = this.#dictionary.filterCaptureOnSquare(formData.captureSquare, formData.captureTurn)
    //         return searchResults
    //     }

    // };



    // initSearchInput() {
    //     // console.log(`Func: initSearchInput`)


    //     const button = document.getElementById('popUpButton');
    //     button.addEventListener('click', () => this.handleOverlayPopup());

    //     const resultsContainer = document.getElementById('results');

    //     // const searchInput = document.getElementById('searchInput');

    //     searchInput.addEventListener('input', () => {

    //         // this.#handleInputEvent()


    //         // The main chessboard is cleared of all its pieces
    //         this.#returnGame(0).resetGame();

    //         // The sideboards are cleared out
    //         this.#clearSideBoards()

    //         // The dictionary returns a list of games based on the search input
    //         const searchResults = this.#searchInDictionary("NAME", this.#readSearchBox())

    //         // The sideboards generated depending on the search results
    //         this.#updateSideBoards(searchResults)


    //         clearTimeout(this.#searchTimeout);
    //         // this.searchCommandActivated()

    //         // // const a = this.#returnGame(0)
    //         // // console.log(a)
    //         // this.#clearMainBoard()
    //         // this.#searchTimeout = setTimeout(() => {
    //         //     // console.log(this.#returnGame(3))
    //         //     const query = searchInput.value.toLowerCase().trim();
    //         //     // const results = this.#dictionary.getEntriesFromAttributes("NAME", query);

    //         //     const results = this.searchInDictionary("NAME", query)
    //         //     this.handleSearchInput(results, resultsContainer);
    //         // }, 500); // Time delay / Debounce
    //     });

    //     this.#searchInputPGN.addEventListener('input', () => {

    //         // The main chessboard is cleared of all its pieces
    //         this.#returnGame(0).resetGame();

    //         // The sideboards are cleared out
    //         this.#clearSideBoards()

    //         const searchResults = this.#searchInDictionary("PGN", this.#readSearchBoxPGN())

    //         // The sideboards generated depending on the search results
    //         this.#updateSideBoards(searchResults)

    //         // this.#handleInputEvent()
    //         clearTimeout(this.#searchTimeout);

    //     });


    // };

    clickEvent_GameElement(event, index) {
        console.log("clickEvent_GameElement")
        console.log(index)
    }


    // #handleGameClickEvent(event, index) {
    //     console.log(`Func: #handleBoardClick  | event=${event} | index=${index}`)
    //     // This is when a chessboard is clicked

    //     // The main chessboard gets wiped
    //     this.#clearMainBoard()

    //     // We store the index of the chessboard that was clicked
    //     const clickedGame = this.#returnGame(index)
    //     // console.log(clickedGame)

    //     // The main Chessboard becomes that chessboard
    //     const newGame = this.#createGame(clickedGame.information, 0, this.#parentELMain)

    //     newGame.initGame();

    //     this.#mainGame = newGame

    // };


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
        // openings.forEach((opening, index) => {
        //     this.#createGame(opening, index + 1, this.#parentELSide)
        // });
        this.UPDATEupdateSideBoards(openings    )
    };


    // readSideGamesToDOM() {
    //     this.sideGames.forEach((opening, index) => {
    //         this.#createGame(opening, index + 1, this.#parentELSide)
    //     });       
    // }



    // readSideGamesToDOM() {
    //     this.sideGames.forEach((opening, index) => {
    //         this.#createGame(opening, index + 1, this.#parentELSide)
    //     });       
    // }



    UPDATEupdateSideBoards(openingArray) {
        console.log(this.sideGames)
        this.sideGames = []
        this.#parentELSide.innerHTML = '';

        

        // Populate FrontPage() array with new games
        openingArray.forEach((opening, index) => {
            // console.log(index)
            // const newGame = this.#createGame(opening, index + 1, this.#parentELSide)
            const newGame = new Game(information, index, parentEl);   // Create the Game
            // newGame.initGame();
            newGame.init()
            this.sideGames.push(newGame)
        });
        console.log(this.sideGames)
    };






    // #createGame(information, index, parentEl) {

    //     if (index ===  0 ) {

    //         // console.log(`Func: #createGame: |  information=${information}  |   index=${index}  |   parentEl=${parentEl}  |`)
    //     }
        
    //     let newGame;

    //     // Create Game() Object
    //     if (index === 0) {


    //         //ITS THIS LINE. THIS IS THE ISSUE.
    //         newGame = new GameInteractive(information, 0, parentEl);   // Create the Game


            
    //     }
    //     else if (index > 0) {
    //         newGame = new Game(information, index, parentEl);   // Create the Game
    //         // newGame.initGame();
    //         newGame.init()

    //         // Create click event
    //         newGame.element.addEventListener('click', (event) => {
    //             this.clickEvent_GameElement(event, index)
    //         })

    //         this.sideGames.push(newGame)
    //     }

    //     this.#mainGame = newGame;

    //     return newGame
    // };



    // createGame(information, index, parentEl) {
    //     newGame = new Game(information, index, parentEl);   // Create the Game
    //     newGame.init()
    //     newGame.element.addEventListener('click', (event) => {
    //         this.clickEvent_GameElement(event, index)
    //     })
    // }


    // #returnGame(index) {
    //     console.log(`Func: returnGame  | index=${index}`)
    //     if (typeof index !== 'number') {
    //         throw new Error(`index: ${index} is not a number. Game could not be returned`)
    //     }
    //     if (index===0) {return this.#mainGame}                            // 0 = Main game board
    //     index -=1   //Reduce index by 1 (to make it fit the base 0 requirements)
    //     return this.#sideGames[index]                                      // Otherwise side board
    // };


    printSeperator() {
        console.log("//////////////////////")
        console.log("//////////////////////")
        console.log("//////////////////////")
    };

    ////////////// ------------------- //////////////
    ////////////// --- FORM SEARCH --- //////////////
    ////////////// ------------------- //////////////

    // handleOverlayPopup() {
    //     this.printSeperator();
    //     this.formDataObject = null; // Reset formDataObject
        
    //     const newForm = new Form();
    //     newForm.eventMethod(this.updateFormData.bind(this));
    // };


    // updateFormData(formData) {
    //     this.formDataObject = formData; // Update formDataObject
    //     this.receiveFormData(); // Call receiveFormData after updating formDataObject
    // };


    // receiveFormData() {
    //     console.log(`Func: receiveFormData || formData=`);
    //     console.log(this.formDataObject);

    //     const searchResult = this.performSearch(this.formDataObject);
    //     console.log(searchResult);

    //     this.#clearSideBoards();
    //     // this.#updateSideBoards(searchResult);
    // };

};

export default FrontPage;

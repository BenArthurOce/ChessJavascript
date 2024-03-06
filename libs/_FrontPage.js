
import Game from "./Game.js";
import StaticOpeningDatabase from "./StaticOpeningDatabase.js";
import dropdownFavourites from './DropdownFavourites.js';
import dropdownECO from "./DropdownECO.js";


class FrontPage {
    #className;
    #mainGameBoard;
    #sideGameBoards;
    #elements;
    constructor() {
        this.#className = "Board";
        this.#mainGameBoard = null;
        this.#sideGameBoards = [];
        this.#elements = {
             btnQuery: document.body.querySelectorAll(`button`)[0]
            ,btnClear: document.body.querySelectorAll(`button`)[1]
            ,input1:  document.body.querySelectorAll(`select`)[0]
            ,input2:  document.body.querySelectorAll(`input`)[0]
            ,input3:  document.body.querySelectorAll(`input`)[1]
            ,mainBoard: document.body.querySelector(`#main-board-container`)
            ,sideBoardContainer: document.body.querySelector(`#side-board-containers`)
        };
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


    /**
     * Initializes the front page.
     */
    initPage() {

        // Populate the favourites dropdown
        const favouritesDropdown = document.getElementById('favourites');

        dropdownFavourites.forEach(favourite => {
            const option = document.createElement('option');
            option.value = favourite;
            option.textContent = favourite;
            favouritesDropdown.appendChild(option);
        });

        const ecoDropdown = document.getElementById('dropdownECO');

        dropdownECO.forEach(eco => {
            const option = document.createElement('option');
            option.value = eco;
            option.textContent = eco;
            ecoDropdown.appendChild(option);
        });

        // Event Listener for rendering boards to page
        this.elements.btnQuery.addEventListener('click', () => {
            this.renderBoardsToPage()
        });

        // Event Listener for clearing boards
        this.elements.btnClear.addEventListener('click', () => {
            this.clearAllBoards();
        });
    };

    
    /**
     * Renders Chessboards to DOM
     */
    async renderBoardsToPage() {
        const searchCategory = this.elements.input1.value;
        const searchTerm = this.elements.input2.value;
        const moveNumber = this.elements.input3.value;

        // After reading the database, returns the results into a variable
        const databaseResults = await this.queryDatabase(searchCategory, searchTerm, moveNumber);
        // console.log(databaseResults)

        // Takes the database results and creates new Games based on the information
        this.loadChessBoards(databaseResults);
    };


    /**
     * Queries the database.
     * @param {string} searchCategory The search category.
     * @param {string} searchTerm The search term.
     * @param {string} moveNumber The move number.
     * @returns {Promise<Object>} The filtered openings.
     */
    async queryDatabase(searchCategory, searchTerm, moveNumber) {
        try {
            await StaticOpeningDatabase.initialize();
            return StaticOpeningDatabase.filterOpeningDict(searchCategory, searchTerm, moveNumber);
        } catch (error) {
            console.error("An error occurred:", error);
            return null;
        }
    };


    /**
     * Loads chess boards.
     * @param {Object} openings The openings to load.
     */
    async loadChessBoards(openings) {
        let index = 1;
        for (const key in openings) {
            if (openings.hasOwnProperty(key)) {
                const opening = openings[key];
                const newGame = new Game(opening, index);
                newGame.initGame();
                this.sideGameBoards.push({ index, game: newGame });
                index++;
            }
        }
    };


    /**
     * Clears all boards.
     */
    clearAllBoards() {
        while (this.elements.sideBoardContainer.firstChild) {
            this.elements.sideBoardContainer.removeChild(this.elements.sideBoardContainer.firstChild);
            this.sideGameBoards.pop();
        }
    };

};

export default FrontPage;
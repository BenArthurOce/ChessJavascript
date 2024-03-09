import {Game, GameTest} from "./Game.js";
import StaticOpeningDatabase from "./StaticOpeningDatabase.js";
import dropdownFavourites from './DropdownFavourites.js';
import dropdownECO from "./DropdownECO.js";

class FrontPage {
    #className;
    #mainGameBoard;
    #sideGameBoards;
    #elements;
    #allTwoMoveContinuations;
    #allThreeMoveContinuations;

    constructor() {
        this.#className = "Board";
        this.#mainGameBoard = null;
        this.#sideGameBoards = [];
        this.#elements = {
            btnQuery: document.querySelector('button[data-action="query"]'),
            btnClear: document.querySelector('button[data-action="clear"]'),
            input1: document.querySelector('select[name="searchCategory"]'),
            input2: document.querySelector('input[name="searchTerm"]'),
            input3: document.querySelector('input[name="moveNumber"]'),
            mainBoard: document.querySelector('#main-board-container'),
            sideBoardContainer: document.querySelector('#side-board-containers')
        };
        this.#allTwoMoveContinuations = [];
        this.#allThreeMoveContinuations = [];
    };

    async initPage() {
        this.setupSearchInput();
        await this.populateDropdowns();
        this.setupEventListeners();
    };

    setupSearchInput() {
        const searchInput = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('results');

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            const results = Object.values(StaticOpeningDatabase).filter(opening =>
                opening.PGN.toLowerCase().includes(query) || opening.NAME.toLowerCase().includes(query)
            );
            this.displayResults(results, resultsContainer);
        });
    }

    displayResults(results, container) {
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
    }

    async populateDropdowns() {
        const favouritesDropdown = document.getElementById('favourites');
        dropdownFavourites.forEach(favourite => this.createDropdownOption(favouritesDropdown, favourite));

        const ecoDropdown = document.getElementById('dropdownECO');
        dropdownECO.forEach(eco => this.createDropdownOption(ecoDropdown, eco));
    }

    createDropdownOption(dropdown, value) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    }

    setupEventListeners() {
        this.#elements.btnQuery.addEventListener('click', () => {
            this.clearAllBoards();
            this.renderBoardsToPage();
        });

        this.#elements.btnClear.addEventListener('click', () => {
            this.clearAllBoards();
        });
    }

    async renderBoardsToPage() {
        const searchCategory = this.#elements.input1.value;
        const searchTerm = this.#elements.input2.value;
        const moveNumber = this.#elements.input3.value;
        const databaseResults = await this.queryDatabase(searchCategory, searchTerm, moveNumber);
        this.loadChessBoards(databaseResults);
    }

    async queryDatabase(searchCategory, searchTerm, moveNumber) {
        try {
            await StaticOpeningDatabase.initialize();
            return StaticOpeningDatabase.filterOpeningDict(searchCategory, searchTerm, moveNumber);
        } catch (error) {
            console.error("An error occurred:", error);
            return null;
        }
    }

    async loadChessBoards(openings) {
        let index = 1;
        for (const key in openings) {
            if (openings.hasOwnProperty(key)) {
                const opening = openings[key];
                const newGame = new Game(opening, index);
                newGame.initGame();
                this.#sideGameBoards.push({ index, game: newGame });
                index++;
            }
        }
    }

    clearAllBoards() {
        while (this.#elements.sideBoardContainer.firstChild) {
            this.#elements.sideBoardContainer.removeChild(this.#elements.sideBoardContainer.firstChild);
            this.#sideGameBoards.pop();
        }
    }
}

export default FrontPage;

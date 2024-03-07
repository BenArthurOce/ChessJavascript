
import Game from "./Game.js";
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
    #openings
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
        this.#allTwoMoveContinuations = []
        this.#allThreeMoveContinuations = []
        this.#openings = null
        // this.initpage2()


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
    get openings() {
        return this.#openings;
    };
    set openings(value) {
        this.#openings = value;
    };



    initPage2() {

        console.log(this.openings)

        const searchInput = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('results');

        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const results = [];
            console.log(this.openings)
            for (const key in this.openings) {
                const opening = this.openings[key];
                console.log(key)
                console.log(query)
                if (key.toLowerCase().includes(query) || opening.NAME.toLowerCase().includes(query)) {
                    results.push(opening);
                }
            }
            displayResults(results);
        });

        function displayResults(results) {
            console.log("displayResults")
            resultsContainer.innerHTML = '';
            if (results.length === 0) {
                resultsContainer.innerHTML = '<li>No results found</li>';
                return;
            }
            results.forEach(result => {
                const li = document.createElement('li');
                li.textContent = `${result.PGN}: ${result.NAME}`;
                resultsContainer.appendChild(li);
            });
        }
    }

    /**
     * Initializes the front page.
     */
    async initPage() {

        //Dictionary of all openings
        this.openings =  await this.queryDatabase("EVERYTHING", "", null);
        



        // This is a list of 2 move, and 3 move openings that have a continuation
        const tempTwoMove = await this.queryDatabase("ALLCONTINUATIONS", '-', 2)
        const tempThreeMove = await this.queryDatabase("ALLCONTINUATIONS", '-', 3)

        this.allTwoMoveContinuations = Object.values(tempTwoMove).map(a => a['PGN'])
        this.allThreeMoveContinuations = Object.values(tempThreeMove).map(a => a['PGN'])

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
            this.clearAllBoards();
            //Need something that queries the database first
            this.renderBoardsToPage();
        });

        // Event Listener for clearing boards
        this.elements.btnClear.addEventListener('click', () => {
            this.clearAllBoards();
        });



        //////////////////////////////////////////////////////////////

        const searchInput = document.getElementById('searchInput');

        // searchInput.addEventListener('input', () => {
        //     this.performSearch()
        // });

        document.querySelector(`#searchInput`).addEventListener('input', this.performSearch.bind(this));

    
    };


    async performSearch(event) {
        const searchInput = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('results');
        
        // Get the query from the search input
        const query = searchInput.value.toLowerCase().trim();
        console.log(query);


        console.log(this.openings)

        // Array to store matching results
        const results = [];

        // Iterate through the openings and check if the query matches the opening key or name
        for (const key in this.openings) {
            if (this.openings.hasOwnProperty(key)) {
                const opening = this.openings[key];
                if (key.toLowerCase().includes(query) || opening.NAME.toLowerCase().includes(query)) {
                    results.push(opening);
                }
            }
        }

        // Display the matching results
        displayResults(results);
    

        // searchInput.addEventListener('input', function() {
        //     const query = this.value.toLowerCase().trim();
        //     const results = [];
        //     console.log(this.openings)
        //     for (const key in this.openings) {
        //         const opening = this.openings[key];
        //         console.log(key)
        //         console.log(query)
        //         if (key.toLowerCase().includes(query) || opening.NAME.toLowerCase().includes(query)) {
        //             results.push(opening);
        //         }
        //     }
        //     displayResults(results);
        // });

        function displayResults(results) {
            console.log("displayResults")
            resultsContainer.innerHTML = '';
            if (results.length === 0) {
                resultsContainer.innerHTML = '<li>No results found</li>';
                return;
            }
            results.forEach(result => {
                const li = document.createElement('li');
                li.textContent = `${result.PGN}: ${result.NAME}`;
                resultsContainer.appendChild(li);
            });
        }
    }

    
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
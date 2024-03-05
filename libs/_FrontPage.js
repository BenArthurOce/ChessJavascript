
import Game from "./Game.js";
import StaticOpeningDatabase from "./StaticOpeningDatabase.js";

class FrontPage {
    #className;
    #objectType
    #elements
    #mainGameBoard
    #sideGameBoards
    constructor() {
        this.#className = "Board"; 
        this.objectType = "Factory/DOM"

        this.#elements = {
             button1: document.body.querySelectorAll(`button`)[0]
            ,button2: document.body.querySelectorAll(`button`)[1]
            ,input1:  document.body.querySelectorAll(`input`)[0]
            ,input2:  document.body.querySelectorAll(`input`)[1]
            ,input3:  document.body.querySelectorAll(`input`)[2]
        }
    };
    get className() {return this.#className;};
    set className(value) {this.#className = value;};
    get objectType() {return this.#objectType;};
    set objectType(value) {this.#objectType = value;};
    get elements() {return this.#elements;};
    get mainGameBoard() {return this.#mainGameBoard;};
    set mainGameBoard(value) {this.#mainGameBoard = value;};
    get sideGameBoards() {return this.#sideGameBoards;};
    set sideGameBoards(value) {this.#sideGameBoards = value;};


    initPage() {
        const a = `1. e4 e6 2. d4 d5 3. Nd2 Nf6 4. e5 Nfd7 5. Bd3 c5 6. c3 Nc6 7. Ne2 cxd4`
        const b = '1.d4 Nf6 2.c4 c5 3.d5 b5'
        const c = `1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Qd2 Nc6 10. O-O-O c4`
        
        const myOpenings = [a, b, c];

        // const newGame = new Game(a);
        // newGame.initGame()

        // const newGame2 = new Game(b);
        // newGame2.initGame()

        // const newGame3 = new Game(c);
        // newGame3.initGame()

        
        
        this.elements.button1.addEventListener('click', async () => {

            this.elements.button1.addEventListener('click', () => {
                //// Working Code that resets a chessboard
                // newGame.resetGame();
                // newGame.TransferGameToDOM()
                // console.log(newGame.boardState)
                // console.log(newGame.boardHTML)
    
                // Query Database
                const endTest = this.queryDatabase()
                console.log(endTest)
            })

            // Query Database
            const endTest = await this.queryDatabase("ECO", "A00", 3);
            console.log(endTest);
        })




        this.elements.button2.addEventListener('click', async () => {

            this.elements.button2.addEventListener('click', () => {
                //// Working Code that resets a chessboard
                // newGame.resetGame();
                // newGame.TransferGameToDOM()
                // console.log(newGame.boardState)
                // console.log(newGame.boardHTML)

                const searchCategory = this.elements.input1.value;
                const searchTerm = this.elements.input2.value;
                const moveNumber = this.elements.input3.value;
    
                // Query Database
                const endTest = this.queryDatabase(searchCategory, searchTerm, moveNumber)
                console.log(endTest)
            })

            const searchCategory = this.elements.input1.value;
            const searchTerm = this.elements.input2.value;
            const moveNumber = this.elements.input3.value;

            // Query Database
            const endTest = await this.queryDatabase(searchCategory, searchTerm, moveNumber);
            console.log(endTest);

            this.loadChessBoards(endTest)
        })
    };

    async queryDatabase(searchCategory, searchTerm, moveNumber) {
        try {
            await StaticOpeningDatabase.initialize();
            const filteredOpenings = StaticOpeningDatabase.filterOpeningDict(searchCategory, searchTerm, moveNumber);
            return filteredOpenings;
        } catch (error) {
            console.error("An error occurred:", error);
            return null; // or handle error in some other way
        }
    };


    async loadChessBoards(openings) {

        for (const opening in openings) {
            console.log(opening)

            const newOpening = new Game(opening)
            newOpening.initGame()
        }
    };

};

export default FrontPage
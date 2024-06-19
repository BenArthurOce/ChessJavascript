// import Command from "./Command";
import Command from "./Command.js";
import { Game, GameLarge, GameSmall} from "../libs/Game.js";


class GenerateSideboardsCommand extends Command {
    constructor(frontpage, arrayOpeningObjects, parentElement) {
        super();
        this.frontpage = frontpage;
        this.arrayOpeningObjects = arrayOpeningObjects;
        this.parentElement = parentElement;
    };

    execute() {
        console.log(`\tCommand: GenerateSideboardsCommand - Execute`);

        this.parentElement.innerHTML = '';  // Clear all sideboards
        const gameObjects = []  // List of all Game() Objects

        // Define a function to create a chessboard asynchronously
        const createChessboardAsync = async (opening, index) => {
            const sideChessboard = new GameSmall(opening, index + 1, this.parentElement, opening.FEN);
            gameObjects.push(sideChessboard)
            await sideChessboard.updateGameInformation(opening);
            sideChessboard.render();
        };
        
        // Run the creation of each chessboard asynchronously
        const creationPromises = this.arrayOpeningObjects.map((opening, index) => createChessboardAsync(opening, index));

        // Wait for all chessboards to be created before attaching event listeners
        Promise.all(creationPromises)
            .then(() => {
                gameObjects.forEach((gameObj, index) => {
                    gameObj.element.addEventListener('click', (event) => {
                        console.log("board clicked in GenerateSideboardsCommand, needs to be moved to Game")        
                    });
                });
            })
            .catch(error => {
                console.error("Error creating chessboards:", error);
            });
    };

    undo() {
        console.log(`\tCommand: GenerateSideboardsCommand - Undo`);
    };
};

export default GenerateSideboardsCommand;


import Interface from "./()Interface.js";

class CreateMainBoard extends Interface {
    constructor(receiver, game, fen) {
        super();
        this.receiver = receiver;
        this.game = game;
        this.fen = fen;
    }

    execute(...args) {
        console.log("CreateMainBoard.js - execute")
        this.receiver.runCreateMainBoard(this.game, this.fen);
    }
};

export default CreateMainBoard;
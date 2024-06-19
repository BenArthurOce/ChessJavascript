import Interface from "./()Interface.js";

class PlacePiecesFromFENCommand extends Interface {
    constructor(receiver, game, fen) {
        super();
        this.receiver = receiver;
        this.game = game;
        this.fen = fen;
    }

    execute(...args) {
        console.log("PlacePiecesFromFENCommand.js - execute")
        this.receiver.runPlacePiecesFromFENCommand(this.game, this.fen);
    }
};

export default PlacePiecesFromFENCommand;
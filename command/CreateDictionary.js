import Interface from "./()Interface.js";

class CreateDictionary extends Interface {
    constructor(receiver, game, fen) {
        super();
        this.receiver = receiver;
        this.game = game;
        this.fen = fen;
    }

    execute(...args) {
        console.log("CreateDictionary - execute")
        this.receiver.runCreateDictionary(this.game, this.fen);
    }
};

export default CreateDictionary;
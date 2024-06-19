import Interface from "./()Interface.js";

class MovePieceCommand extends Interface {
    constructor(receiver, obj) {
        super();
        this.receiver = receiver;
        this.obj = obj;
    }

    execute(...args) {
        console.log("MovePieceCommand - execute")
        this.receiver.runMovePieceCommand(this.obj);
    }
};

export default MovePieceCommand;
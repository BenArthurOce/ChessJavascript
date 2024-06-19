import Command from './Command.js';

class StoredFENChangeCommand extends Command {
    constructor(receiver, fen) {
        super();
        this.receiver = receiver;
        this.fen = fen;
    }

    execute() {
        this.receiver.callback_onStoredFENchange(this.fen);
    }
}

export default StoredFENChangeCommand;

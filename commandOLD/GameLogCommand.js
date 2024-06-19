class GameLogCommand {
    constructor(message) {
        this.message = message;
    }

    execute() {
        console.log(`Game Log: ${this.message}`);
    }
}

export default GameLogCommand;

//This file defines an invoker class that invokes commands based on user actions or other triggers.

class CommandInvoker {
    constructor(commandManager) {
        this.commandManager = commandManager;
    }

    invoke(command) {
        this.commandManager.execute(command);
    }
}

export default CommandInvoker;

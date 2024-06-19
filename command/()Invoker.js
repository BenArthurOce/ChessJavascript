class Invoker {
    constructor() {
        this.commands = {}
        this.history = []
    };

    register(commandName, command) {
        this.commands[commandName] = command
    };

    execute(commandName) {
        if (this.commands.hasOwnProperty(commandName)) {
            this.commands[commandName].execute();
            // this.history.push([DateTime.now().toMillis(), commandName]);
        } else {
            // const input = prompt(`Command [${commandName}] not recognized.\nType any input to continue`);
            console.log(`Command ${commandName} not recognized.`)
        }
    };

    replay_last(numberOfCommands) {
        const commands = this.history.slice(-numberOfCommands);
        commands.forEach(command => {
            this.execute(command[1]);
        });
    }

};

export default Invoker;
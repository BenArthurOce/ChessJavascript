import Interface from "./()Interface.js";

// Define CommandDoorClose class
class CommandSample2 extends Interface {
    constructor(receiver, obj) {
        super();
        this.receiver = receiver;
        this.obj = obj;
    }

    execute(...args) {
        console.log("CommandSample2 - execute")
        this.receiver.runCommand2(this.obj);
    }
};

export default CommandSample2;
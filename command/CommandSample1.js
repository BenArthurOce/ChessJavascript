import Interface from "./()Interface.js";

// Define CommandDoorClose class
class CommandSample1 extends Interface {
    constructor(receiver, obj) {
        super();
        this.receiver = receiver;
        this.obj = obj;
    }

    execute(...args) {
        console.log("CommandSample1 - execute")
        this.receiver.runCommand1(this.obj);
    }
};

export default CommandSample1;
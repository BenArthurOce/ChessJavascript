import Interface from "./()Interface.js";

// Define CommandDoorClose class
class CommandSample3 extends Interface {
    constructor(receiver, obj) {
        super();
        this.receiver = receiver;
        this.obj = obj;
    }

    execute(...args) {
        console.log("CommandSample3 - execute")
        this.receiver.runCommand3(this.obj);
    }
};

export default CommandSample3;
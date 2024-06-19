
class Receiver {

    runCommand1(object) {
        console.log("Receiver - runCommand1")
        object["hello"] = 1
        console.log(object)
    };

    runCommand2(object) {
        console.log("Receiver - runCommand2")
        console.log(object)
    };

    runCommand3(object) {
        console.log("Receiver - runCommand3")
        console.log(object)
    };

    runCommand4(object) {
        console.log("Receiver - runCommand4")
        console.log(object)
    };

    runCommand5(object) {
        console.log("Receiver - runCommand5")
        console.log(object)
    };

    runCommand6(object) {
        console.log("Receiver - runCommand6")
        console.log(object)
    };

};


export default Receiver;
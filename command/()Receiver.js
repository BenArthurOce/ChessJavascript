
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

    runMovePieceCommand(object) {
        console.log("Receiver - runMovePieceCommand")
        console.log(object)
    };

    runPlacePiecesFromFENCommand(game, fen) {
        console.log("Receiver - runPlacePiecesFromFENCommand")
        console.log(game)
        console.log(fen)
    };

    runCreateMainBoard(game, fen) {
        console.log("Receiver - runCreateMainBoard")
        // console.log(game)
        // console.log(fen)
    };

    runCreateDictionary(dictionary) {
        console.log("Receiver - runCreateDictionary")

        // console.log(game)
        // console.log(fen)
    };
    

};


export default Receiver;
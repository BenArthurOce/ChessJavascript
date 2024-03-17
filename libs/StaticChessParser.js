import StaticChessUtility from './StaticChessUtility.js';
import StaticErrorCheck from './StaticErrorCheck.js';


class StaticParser {
    #fullNotationString
    #parsedMoves;
    #nextPlayerToMove
    constructor(string) {
        this.#parsedMoves = {};
        this.#fullNotationString = string
        this.runParser(string);
        // this.#nextPlayerToMove = this.getNextPlayerToMove();
        // console.log(this.parsedMoves)
    };
    get fullNotationString() {
        return this.#fullNotationString;
    };
    get parsedMoves() {
        return this.#parsedMoves;
    };
    set parsedMoves(value) {
        this.#parsedMoves = value;
    };
    get nextPlayerToMove() {
        return this.#nextPlayerToMove;
    };
    set nextPlayerToMove(value) {
        this.#nextPlayerToMove = value;
    };


    runParser(string) {
        // console.log(string)
        // First, convert the game notation string into a dictionary/object of single move notations
        const moveDictionary = this.getDictionaryOfMoves(string);
        // console.log(moveDictionary)

        // Second, use each single move notation to construct "moveInfo", which details facts about the move
        for (const [eachKey, eachValue] of Object.entries(moveDictionary)) {
            this[eachKey] = [
                this.createSingleMoveObject(eachKey, eachValue[0], 0) // We make instructions for White
                , eachValue[1] ?    // If there is a move for black
                this.createSingleMoveObject(eachKey, eachValue[1], 1) // Then we make instructions for Black
                : null              // Otherwise leave Black null
            ];
        };

        // Second, use each single move notation to construct "moveInfo", which details facts about the move
        // try {
        //     for (const [eachKey, eachValue] of Object.entries(moveDictionary)) {
        //         this[eachKey] = [
        //             this.createSingleMoveObject(eachKey, eachValue[0], 0) // White
        //             , eachValue[1] ? this.createSingleMoveObject(eachKey, eachValue[1], 1) : null // Black
        //         ];
        //     };
        // } catch {
        //     // throw new Error("The notation failed to convert into move objects", this.printToTerminal())
        // };
    };


    getDictionaryOfMoves(notationString) {
        // Get the game notation string, and create an array of all the moves
        // const regexPattern = /\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?/;
        const regexPattern =/\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?(?:#)?/;
        const splitNotation = notationString.split(regexPattern).filter(a => a !== '');

        const result = {};
        for (let x = 0; x < splitNotation.length; x += 3) {
            const key = parseInt(splitNotation[x].replace('.', ''));
            const value = [splitNotation[x + 1], splitNotation[x + 2]];
            result[key] = value;
        };

        this.parsedMoves = result;

        return result;
    };


    createSingleMoveObject(turnNum, notation, teamNum) {
        // console.log("createSingleMoveObject")
        // console.log(`turnNum=${turnNum}, notation=${notation}, teamNum=${teamNum}`)
        // Regular expression to match chess algebraic notation
        // let regex = /^(?<piece>[NBRQK])?(?<file>[a-h])?(?<rank>[1-8])?(?<capture>x)?(?<target>[a-h][1-8])((?:[NBRQ])?(?<check>\+|\#)?(?:=(?<promotion>[NBRQ]))?)?|^(O-O(?:-O)?)$/;
        let regex = /^(?<piece>[NBRQK])?(?<file>[a-h])?(?<rank>[1-8])?(?<capture>x)?(?<target>[a-h][1-8])((?:[NBRQ])?(?<check>\+|#)?(?:=(?<promotion>[NBRQ]))?)?(#)?|^(O-O(?:-O)?)$/;


        // Executing the regular expression on the input notation
        let match = notation.match(regex);
        // console.log(match)

        if (!match) {
            console.error("Invalid chess notation.");
            return null;
        };

        // console.log("Checking if the input notation matches the expected pattern")
        // Checking if the input notation matches the expected pattern
        if (match) {
            // Prepare all move information as null
            let chessMove = {
                 fullNotationString: this.fullNotationString // full context of the PGN
                ,notation: null // move notation
                ,teamNumber: null // 0 = White, 1 = Black
                ,turnNumber: null // Turn Number
                ,pieceCode: null // Piece code
                ,locationSquare: null // Current location of piece
                ,locationPosY: null // Location file (If supplied)
                ,locationPosX: null // Location rank (If supplied)
                ,isCapture: null // Boolean if move resulted in capture
                ,targetSquare: null // Location of destination square
                ,targetPosX: null // Base 0  of destination rank square
                ,targetPosY: null // Base 0 of destination file square
                ,isPromotion: null // Boolean if pawn move resulted in promotion
                ,isCheckOrMate: null // Boolean if move resulted in check or mate
                ,promotedPiece: null // Piece code that was promoted from pawn move
                ,castlingSide: null // Kingside or Queenside if castling occurred
                ,fullPieceCode: null // Combination of team number and piece code
                ,locationRow: null // Array (base 0) of location square
                ,locationCol: null // Array (base 0) of location square
                ,targetArray: null // Array (base 0) of destination square
                ,locationArray: null // Kept blank. Used for printToTerminal completeness

                ,printToTerminal: function() {
                    console.log(`------Debug Move Map Details------`);
                    console.log(`teamNumber: ${this.teamNumber} | turnNumber: ${this.turnNumber} | notation: ${this['notation']}`);
                    console.log(`pieceCode: ${this.pieceCode} | fullPieceCode: ${this.fullPieceCode}`);
                    console.log(`targetSquare: ${this.targetSquare} | targetPosX: ${this.targetPosX} | targetPosY: ${this.targetPosY} | targetArray: ${this.targetArray}`);
                    console.log(`locationSquare: ${this.locationSquare} | locationPosX: ${this.locationPosX} | locationPosY: ${this.locationPosY} | locationArray: ${this.locationArray}`);
                    console.log(`locationRow: ${this.locationRow} | locationCol: ${this.locationCol}`);
                    console.log(`castlingSide: ${this.castlingSide} | isCapture: ${this.isCapture} | isCheckOrMate: ${this.isCheckOrMate} | isPromotion: ${this.isPromotion}`);
                    console.log(`fullNotationString: ${this.fullNotationString}`);
                    console.log(`-----------------------`);
                }
            };

            // console.log("Review castling")
            if (notation === "O-O") {chessMove.castlingSide = "Kingside"; return chessMove;}
            if (notation === "O-O-O") {chessMove.castlingSide = "Queenside"; return chessMove;}

            // console.log("Take the regex and apply the information to the move instructions  ")
            // Take the regex and apply the information to the move instructions  
            chessMove.teamNumber = teamNum;
            chessMove.turnNumber = turnNum;
            chessMove.notation = match[0] || null;
            chessMove.pieceCode = match[1] || 'p';
            chessMove.locationPosY = match[2] || null;
            chessMove.locationPosX = match[3] || null;
            chessMove.isCapture = /[x]/.test(match[4]) ? true : false;
            chessMove.targetSquare = match[5];
            chessMove.isPromotion = /[=]/.test(match[6]) ? true : false;
            chessMove.isCheckOrMate = /[+#]/.test(match[7]) ? true : false;
            chessMove.promotedPiece = match[9] || null;

            // console.log("Add additional data")
            // Add additional data
            chessMove.fullPieceCode = teamNum + chessMove.pieceCode;
            chessMove.targetPosX = StaticChessUtility.rowRefToArray(chessMove.targetSquare[1]);
            chessMove.targetPosY = StaticChessUtility.colRefToArray(chessMove.targetSquare[0]);
            if (chessMove.notation === "O-O") {chessMove.castlingSide = "Kingside"};
            if (chessMove.notation === "O-O-O") {chessMove.castlingSide = "Queenside"};
            if (chessMove.castlingSide === null) {chessMove.castlingSide = false};
            chessMove.targetArray = [chessMove.targetPosX, chessMove.targetPosY];

            if (chessMove.locationPosX || chessMove.locationPosY) {
                chessMove.locationRow = StaticChessUtility.rowRefToArray(chessMove.locationPosX);
                chessMove.locationCol = StaticChessUtility.colRefToArray(chessMove.locationPosY);
            };


            // console.log("Error check")

            if (chessMove.notation === null) {
                console.log("chessMove.notation === null")
                throw new Error("Invalid notation. Must not be null.");
            }

            if (!(chessMove.notation.length > 0)) {
                console.log("ERROR - moveObject.notation.length > 0")
                throw new Error("Invalid notation. It must have a length greater than 0.");
            }

            if (!(chessMove.teamNumber == 0 || chessMove.teamNumber == 1)) {
                console.log("ERROR - moveObject.notation.length > 0")
                throw new Error("Invalid team number. It must be either 0 or 1.");
            }
        
            if (!(chessMove.turnNumber > 0)) {
                console.log("ERROR - moveObject.notation.length > 0")
                throw new Error("Invalid turn number. It must be greater than 0.");
            }
        
            if (!(chessMove.pieceCode.length === 1)) {
                console.log("ERROR - moveObject.pieceCode.length === 1")
                throw new Error("Invalid piece code length. It must be exactly 1 character long.");
            }
        
            if (!(chessMove.targetPosX >= 0)) {
                console.log("ERROR - moveObject.targetPosX >= 0")
                throw new Error("Invalid target position X. It must be greater than or equal to 0.");
            }
        
            if (!(chessMove.targetPosY >= 0)) {
                console.log("ERROR - moveObject.targetPosY >= 0")
                throw new Error("Invalid target position Y. It must be greater than or equal to 0.");
            }
        
            if (!(chessMove.fullPieceCode.length === 2)) {
                console.log("ERROR - moveObject.fullPieceCode.length === 2")
                throw new Error("Invalid full piece code length. It must be exactly 2 characters long.");
            }
        
            if (!(chessMove.targetArray.length === 2)) {
                console.log("ERROR - moveObject.targetArray.length === 2")
                throw new Error("Invalid target array length. It must contain exactly 2 elements.");
            }
        
            if (!(chessMove.targetSquare.length === 2)) {
                console.log("ERROR - moveObject.targetSquare.length === 2")
                throw new Error("Invalid target square length. It must be exactly 2 characters long.");
            }
        
            if (!(chessMove.castlingSide === "Kingside" || chessMove.castlingSide === "Queenside" || chessMove.castlingSide === false)) {
                console.log("ERROR - CASTLE SIDE")
                throw new Error("Invalid Castling value. It must be either 'Kingside', 'Queenside', or false.");
            }

            // console.log("CHESS MOVE")
            // console.log(chessMove)

            
            return chessMove;
        };

        // If it fails, require error handle
        return null;
    };



    // Method to determine which player would move next
    // getNextPlayerToMove() {
    //     const totalMoves = Object.keys(this.parsedMoves).length;
    //     const lastMove = this.parsedMoves[totalMoves]; // Get the moves of the last turn

    //     // If the second move is "undefined", then its blacks turn to move. Otherwise its white
    //     if (lastMove[1] === undefined) {
    //         return "Black"
    //     } else {
    //         return "White"
    //     }
    // };


    printToTerminal() {
        console.log(`------Debug Parser Details------`);
        for (const [turnNum, movesArray] of Object.entries(this.parsedMoves)) {
            console.log(`turn number: ${turnNum} | white: ${movesArray[0]} | black: ${movesArray[1]}`);
        };
        console.log(`-----------------------`);
    };

    checkForErrors() {

    };
};

export default StaticParser;
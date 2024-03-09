import StaticChessUtility from './StaticChessUtility.js';
import StaticErrorCheck from './StaticErrorCheck.js';


class StaticParser {
    #parsedMoves;
    #regx;
    constructor(string) {
        this.#parsedMoves = {};
        this.#regx = /\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?(?:#)?/;
        this.runParser(string);
    };
    get parsedMoves() {
        return this.#parsedMoves;
    };
    set parsedMoves(value) {
        this.#parsedMoves = value;
    };
    get regex() {
        return this.#regx;
    };


    runParser(string) {
        // First, convert the game notation string into a dictionary/object of single move notations
        const moveDictionary = this.getDictionaryOfMoves(string);
        // console.log(moveDictionary)

        // Second, use each single move notation to construct "moveInfo", which details facts about the move
        try {
            for (const [eachKey, eachValue] of Object.entries(moveDictionary)) {
                this[eachKey] = [
                    this.createSingleMoveObject(eachKey, eachValue[0], 0) // White
                    , eachValue[1] ? this.createSingleMoveObject(eachKey, eachValue[1], 1) : null // Black
                ];
            };
        } catch {
            // throw new Error("The notation failed to convert into move objects", this.printToTerminal())
        };
        // console.log(this.parsedMoves);
    };


    getDictionaryOfMoves(notationString) {
        // console.log("getDictionaryOfMoves")
        // Get the game notation string, and create an array of all the moves
        // const regexPattern = /\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?/;
        const splitNotation = notationString.split(this.regex).filter(a => a !== '');

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
        // let regex = /\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?(?:#)?/;
        let regex = /^(?<piece>[NBRQK])?(?<file>[a-h])?(?<rank>[1-8])?(?<capture>x)?(?<target>[a-h][1-8])((?:[NBRQ])?(?<check>\+|#)?(?:=(?<promotion>[NBRQ]))?)?(#)?|^(O-O(?:-O)?)$/;


        notationToSto = '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. Ne1 Nd7 10. f3 f5"'
        if(notationToSto === notation) {
            throw new Error("stop")
        }

        // Executing the regular expression on the input notation
        let match = notation.match(regex);
        // console.log(match)


        // Checking if the input notation matches the expected pattern
        if (!match) {
            console.error("Invalid chess notation.");
            return null;
        };

        // console.log("start match")

        // Checking if the input notation matches the expected pattern
        if (match) {
            // Prepare all move information as null
            let chessMove = {
                 notation: null // move notation
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
                    console.log(`-----------------------`);
                }
            };

            // console.log("Check notations")
            if (notation === "O-O") {chessMove.castlingSide = "Kingside"; return chessMove;}
            if (notation === "O-O-O") {chessMove.castlingSide = "Queenside"; return chessMove;}

            // console.log("take regex")
            // Take the regex and apply the information to the move instructions  
            chessMove.teamNumber = teamNum;
            chessMove.turnNumber = turnNum;
            chessMove.notation = match[0] || null;
            chessMove.pieceCode = match[1] || 'p';
            chessMove.locationPosY = match[2] || null;
            chessMove.locationPosX = match[3] || null;
            chessMove.isCapture = match[4] === 'x';
            chessMove.targetSquare = match[5];
            chessMove.isPromotion = match[6] || null;
            chessMove.isCheckOrMate = match[7] || null;
            chessMove.promotedPiece = match[9] || null;

        // Error needs to check
        // Nothing is undefined
        // notation has text in it
        // teamNumber is a 1 or 0
        // turnNumber is a number that isnt 0
        // pieceCode is a single character letter
        // isCapture must either true or false
        // targetPosX must be populated
        // targetPosY must be populated
        // isPromotion must either be true or false
        // isCheckOrMate must be true or false
        // fullPieceCode must be two characters long
        // targetArray must be populated with two elements


            // if (
            //     chessMove.isCapture !== true &&
            //     chessMove.isCapture !== false
            // ) {
            //     console.error("Invalid 'isCapture' value.");
            //     return null;
            // }


            // // if (typeof chessMove.targetPosX !== 'number' || typeof chessMove.targetPosY !== 'number') {
            // //     console.error("Invalid target position.");
            // //     return null;
            // // }

            // if (
            //     chessMove.isPromotion !== true &&
            //     chessMove.isPromotion !== false
            // ) {
            //     console.error("Invalid 'isPromotion' value.");
            //     return null;
            // }

            // if (
            //     chessMove.isCheckOrMate !== true &&
            //     chessMove.isCheckOrMate !== false
            // ) {
            //     console.error("Invalid 'isCheckOrMate' value.");
            //     return null;
            // }

            // if (typeof chessMove.fullPieceCode !== 'string' || chessMove.fullPieceCode.length !== 2) {
            //     console.error("Invalid 'fullPieceCode' value.");
            //     return null;
            // }

            // if (!Array.isArray(chessMove.targetArray) || chessMove.targetArray.length !== 2) {
            //     console.error("Invalid 'targetArray' value.");
            //     return null;
            // }

            // Add additional data
            chessMove.fullPieceCode = teamNum + chessMove.pieceCode;
            chessMove.targetPosX = StaticChessUtility.rowRefToArray(chessMove.targetSquare[1]);
            chessMove.targetPosY = StaticChessUtility.colRefToArray(chessMove.targetSquare[0]);

            // Castling
            if (chessMove.notation === "O-O") {chessMove.castlingSide = "Kingside"};
            if (chessMove.notation === "O-O-O") {chessMove.castlingSide = "Queenside"};
            if (chessMove.castlingSide === null) {chessMove.castlingSide = false}


            chessMove.targetArray = [chessMove.targetPosX, chessMove.targetPosY];

            if (chessMove.locationPosX || chessMove.locationPosY) {
                chessMove.locationRow = StaticChessUtility.rowRefToArray(chessMove.locationPosX);
                chessMove.locationCol = StaticChessUtility.colRefToArray(chessMove.locationPosY);
            };

            StaticErrorCheck.validateMoveObject(chessMove)




            // Move all this into StaticErrorCheck

            // console.log()


            return chessMove;
        };

        // If it fails, require error handle
        return null;


        //
        //

    };


    // let chessMove = {
    //     notation: null // move notation
    //    ,teamNumber: null // 0 = White, 1 = Black
    //    ,turnNumber: null // Turn Number
    //    ,pieceCode: null // Piece code
    //    ,locationSquare: null // Current location of piece
    //    ,locationPosY: null // Location file (If supplied)
    //    ,locationPosX: null // Location rank (If supplied)
    //    ,isCapture: null // Boolean if move resulted in capture
    //    ,targetSquare: null // Location of destination square
    //    ,targetPosX: null // Base 0  of destination rank square
    //    ,targetPosY: null // Base 0 of destination file square
    //    ,isPromotion: null // Boolean if pawn move resulted in promotion
    //    ,isCheckOrMate: null // Boolean if move resulted in check or mate
    //    ,promotedPiece: null // Piece code that was promoted from pawn move
    //    ,castlingSide: null // Kingside or Queenside if castling occurred
    //    ,fullPieceCode: null // Combination of team number and piece code
    //    ,locationRow: null // Array (base 0) of location square
    //    ,locationCol: null // Array (base 0) of location square
    //    ,targetArray: null // Array (base 0) of destination square
    //    ,locationArray: null // Kept blank. Used for printToTerminal completeness


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
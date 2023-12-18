import ChessUtility from './factoryChessUtility.js';


class Parser {
    #parsedMoves;
    constructor(string) {
        this.#parsedMoves = {};
        this.runParser(string);
    };
    get parsedMoves() {
        return this.#parsedMoves;
    };
    set parsedMoves(value) {
        this.#parsedMoves = value;
    };


    runParser(string) {
        // First, convert the game notation string into a dictionary/object of single move notations
        const moveDictionary = this.getDictionaryOfMoves(string);

        // Second, use each single move notation to construct "moveInfo", which details facts about the move
        try {
            for (const [eachKey, eachValue] of Object.entries(moveDictionary)) {
                this[eachKey] = [
                    this.createSingleMoveObject(eachKey, eachValue[0], 0) // White
                    , eachValue[1] ? this.createSingleMoveObject(eachKey, eachValue[1], 1) : null // Black
                ];
            };
        } catch {
            throw new Error("The notation failed to convert into move objects", this.printToTerminal())
        };
    };


    getDictionaryOfMoves(notationString) {
        // Get the game notation string, and create an array of all the moves
        const regexPattern = /\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?/;
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
        // Regular expression to match chess algebraic notation
        let regex = /^(?<piece>[NBRQK])?(?<file>[a-h])?(?<rank>[1-8])?(?<capture>x)?(?<target>[a-h][1-8])((?:[NBRQ])?(?<check>\+|\#)?(?:=(?<promotion>[NBRQ]))?)?|^(O-O(?:-O)?)$/;

        // Executing the regular expression on the input notation
        let match = notation.match(regex);

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

            if (notation === "O-O") {chessMove.castlingSide = "Kingside"; return chessMove;}
            if (notation === "O-O-O") {chessMove.castlingSide = "Queenside"; return chessMove;}

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

            // Add additional data
            chessMove.fullPieceCode = teamNum + chessMove.pieceCode;
            chessMove.targetPosX = ChessUtility.rowRefToArray(chessMove.targetSquare[1]);
            chessMove.targetPosY = ChessUtility.colRefToArray(chessMove.targetSquare[0]);
            if (chessMove.notation === "O-O") {chessMove.castlingSide = "Kingside"};
            if (chessMove.notation === "O-O-O") {chessMove.castlingSide = "Queenside"};
            chessMove.targetArray = [chessMove.targetPosX, chessMove.targetPosY];

            if (chessMove.locationPosX || chessMove.locationPosY) {
                chessMove.locationRow = ChessUtility.rowRefToArray(chessMove.locationPosX);
                chessMove.locationCol = ChessUtility.colRefToArray(chessMove.locationPosY);
            };

            return chessMove;
        };

        // If it fails, require error handle
        return null;
    };


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

export default Parser;
import ChessUtility from './factoryChessUtility.js';


class Parser {
    #cleanedMoves;
    #moveInstructions;
    constructor(string) {
        this.#cleanedMoves = {};
        this.#moveInstructions = {};
        this.runParser(string);
    };
    get cleanedMoves() {
        return this.#cleanedMoves;
    };
    set cleanedMoves(value) {
        this.#cleanedMoves = value;
    };
    get moveInstructions() {
        return this.#moveInstructions;
    };
    set moveInstructions(value) {
        this.#moveInstructions = value;
    };

    runParser(string) {
        // First, convert the game notation string into a dictionary/object of single move notations
        const moveDictionary = this.getDictionaryOfMoves(string);

        // Second, use each single move notation to construct "moveInfo", which details facts about the move
        try {
            for (const [eachKey, eachValue] of Object.entries(moveDictionary)) {
                this[eachKey] = [
                    this.createSingleMoveObject(eachKey, eachValue[0], 0) // White
                    ,eachValue[1] ? this.createSingleMoveObject(eachKey, eachValue[1], 1) : null // Black
                ];
            };
        }
        catch {
            throw new Error ("The notation failed to convert into move objects",
            this.printToTerminal())
        }
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
        }

        this.cleanedMoves = result;
    
        return result;
    };


    createSingleMoveObject(turnNum, notation, teamNum) {
        // Function to get the last two characters of a string
        const getLastTwoChars = (string) => string.slice(-2);
    
        // Function to check if a character is uppercase
        const isUpperCase = (char) => char === char.toUpperCase();
    
        // Function to convert a rank from display format to array format
        const displayRowToArrayRow = (num) => 8 - Number(num);
    
        // Function to convert a file from display format to array format
        const displayCharToArrayCol = (char) => char.charCodeAt(0) - 'a'.charCodeAt(0);
    
        // Function to count alphanumeric characters in a string
        const countAlphaNumeric = (string) => string.replace(/[^a-wyzA-WYZ0-9]/g, "").length;
    
        // Initialize the move object
        const moveObj = {
            'turn-num': turnNum,
            'notation': notation,
            'notationClean': notation.replace(/[^a-zA-Z0-9]/g, ''),
            'team-num': teamNum,
            'piece': isUpperCase(notation[0]) ? notation[0] : 'p',
            'code': teamNum + (isUpperCase(notation[0]) ? notation[0] : 'p'),
            'is-capture': notation.includes('x'),
            'is-checkormate': notation.includes('#'),
            'is-promotion': notation.includes('='),
            'file': getLastTwoChars(notation)[0],
            'rank': null,
            'destinationArr': null,
            'destination': getLastTwoChars(notation),
            'dest-posX': null,
            'dest-posY': null,
            'location': null,
            'loc-posX': null,
            'loc-posY': null,
            'castling-side': null,
    
            // Getter method
            get: function (property) {
                return this[property];
            },
    
            // Setter method
            set: function (property, value) {
                this[property] = value;
            },

            // Print to terminal
            printToTerminal: function() {
                console.log(`------Debug Move Map Details------`);
                console.log(`team-num: ${this['team-num']} | turn-num: ${this['turn-num']} | notation: ${this['notation']} | notationClean: ${this['notationClean']}`);
                console.log(`piece: ${this['piece']} | code: ${this['code']} | file: ${this['file']} | rank: ${this['rank']}`);
                console.log(`destination: ${this['destination']} | dest-posX: ${this['dest-posX']} | dest-posY: ${this['dest-posY']} | destinationArr: ${this['destinationArr']}`);
                console.log(`location: ${this['location']} | loc-posX: ${this['loc-posX']} | loc-posY: ${this['loc-posY']} | castling-side: ${this['castling-side']}`);
                console.log(`castling-side: ${this['castling-side']} | is-capture: ${this['is-capture']} | is-checkormate: ${this['is-checkormate']} | is-promotion: ${this['is-promotion']}`);
                console.log(`-----------------------`);
            }
        };
    
        // Set rank based on the last character of the clean notation
        moveObj.set('rank', displayRowToArrayRow(getLastTwoChars(moveObj.get('notationClean'))[1]));
    
        // Set destination X and Y coordinates
        moveObj.set('dest-posX', displayRowToArrayRow(moveObj.get('destination')[1]));
        moveObj.set('dest-posY', displayCharToArrayCol(moveObj.get('destination')[0]));
        moveObj.set('destinationArr', [moveObj.get('dest-posX'), moveObj.get('dest-posY')]);
    
        // Check for castling
        if (notation === 'O-O') {moveObj.set('castling-side', 'Kingside')}
        if (notation === 'O-O-O') {moveObj.set('castling-side', 'Queenside')}
        
        // pawn captures
        if (moveObj.get('piece') === "p" && moveObj.get('is-capture') === true) {
            const firstChar = notation[0];
            moveObj.set('loc-posY', displayCharToArrayCol(firstChar));
        }
    
        // Check for additional characters in the notation
        if (countAlphaNumeric(notation) === 4) {
            const secondChar = notation[1];
            
            if (!isNaN(secondChar)) {
                moveObj.set('loc-posX', displayRowToArrayRow(secondChar));
            } else if (typeof secondChar === 'string') {
                moveObj.set('loc-posY', displayCharToArrayCol(secondChar));
            };
        };

        return moveObj;
    };


    printToTerminal() {
        console.log(`------Debug Parser Details------`);
        for (const [turnNum, movesArray] of Object.entries(this.cleanedMoves)) {
            console.log(`turn number: ${turnNum} | white: ${movesArray[0]} | black: ${movesArray[1]}`);
        };
        console.log(`-----------------------`);
    };

    checkForErrors() {

    };

};

export default Parser;
import ChessUtility from './factoryChessUtility.js';


const a = '1.e4 e5 2.Nf3 Nc6 3.d4'
const b = '1.d4 e5 2.dxe5 Nc6'
const c = '1.e4 d5 2.Nf3'
const d = '1.e4 e5 2.Nf3 Nc6 3.Bb5 f5'
const e = '1.e4 e5 2.Nf3 Nc6 3.Bc4'
const f = '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5'


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
        const moveDictionary = this.getDictionaryOfMoves(string);
        this.parseDictionaryToMoveInstructions(moveDictionary);
    };

    getDictionaryOfMoves(notationString) {

        // Get the game notation string, and create an array of all the moves
        const regxPattern = /\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?/;
        const splitNotation = notationString.split(regxPattern);
        const filteredArray = splitNotation.filter(item => item.length >= 2); 
    
        const moveObject = {};

        // Get every 1st and 2nd element. Add them to a dictionary as a "tuple"
        for (let i = 0; i < filteredArray.length; i += 2) {
            const turnNumber = Math.floor(i / 2) + 1;
            const pair = filteredArray.slice(i, i + 2);
            moveObject[turnNumber] = pair;
            this.cleanedMoves[turnNumber] = pair;
        };
        return moveObject
    };

    parseDictionaryToMoveInstructions(notationTupleDict) {
        // Take the "tuple" of each pair of moves, and parse them into a Map of what happens on that move
        for (const [eachKey, eachValue] of Object.entries(notationTupleDict)) {
            this[eachKey] = [
                this.createSingleMoveObject(eachKey, eachValue[0], 0) // White
                ,eachValue[1] ? this.createSingleMoveObject(eachKey, eachValue[1], 1) : null // Black
            ];
        };
    };


    createSingleMoveObject(turnNum, notation, teamNum) {

        const getLastTwoChar = (string) => string.slice(-2);

        const moveObj = {
             'turn-num': turnNum
            ,'notation': notation
            ,'notationClean': notation.replace(/[^a-zA-Z0-9]/g, '')
            ,'team-num': teamNum
            ,'piece': null
            ,'code': null
            ,'is-capture': notation.includes('x')
            ,'is-checkormate': notation.includes('#')
            ,'is-promotion': notation.includes('=')
            ,'file': notation.slice(-2)[0]
            ,'rank': null
            ,'destinationArr': null
            ,'destination': ``
            ,'dest-posX': ``
            ,'dest-posY': ``
            ,'location': null
            ,'loc-posX': null
            ,'loc-posY': null
            ,'castling-side': null
    
            ,getLastTwoChar222: (string) => {return string.slice(-2)}
            ,isCapital: (string) => {return string.charAt(0) === string.charAt(0).toUpperCase()}
            ,dispRowToArrRow: (num) => {return {1:7, 2:6, 3:5, 4:4, 5:3, 6:2, 7:1, 8:0}[Number(num)]}
            ,dispChrToArrCol: (string) => {return {'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7}[string]}
            ,countAlphaNumeric: (string) => {return string.replace(/[^a-wyzA-WYZ0-9]/g, "").length}

            ,get: (property) => {return moveObj[property]}
            ,set: (property, value) => { moveObj[property] = value; }
        }


        // ,dispRowToArrRow: (num) => { return ChessUtility.rowRefToArray(Number(num)); }
        // ,dispChrToArrCol: (string) => { return ChessUtility.colRefToArray(string); }


        moveObj['piece'] = moveObj.isCapital(notation) ? notation.charAt(0) : "p";
        moveObj['code'] = teamNum + moveObj['piece']
        moveObj['rank'] = Number(moveObj.getLastTwoChar222(notation)[1])
        moveObj['destination'] = moveObj.getLastTwoChar222(moveObj['notationClean'])
        moveObj['dest-posX'] = moveObj.dispRowToArrRow(moveObj['destination'][1])
        moveObj['dest-posY'] = moveObj.dispChrToArrCol(moveObj['destination'][0])
        moveObj.set('destinationArr', [moveObj.get('dest-posX'), moveObj.get('dest-posY')])

        if (notation === "O-O") {moveObj['castling-side'] = "Kingside"}
        if (notation === "O-O-O") {moveObj['castling-side'] = "Queenside"}
    

        if (moveObj.countAlphaNumeric(notation) === 4 ) {

            // moveObj.set('loc-posX')
            // console.log(notation[1])
            moveObj.set('loc-posY', moveObj.dispChrToArrCol(notation[1]))
            
            // const secondChar = notation[1]

            // if (!isNaN(secondChar)) {
            //     moveObj['dest-posX'] = moveObj.dispRowToArrRow(secondChar)
            // } else if (typeof secondChar === 'string') {
            //     moveObj['dest-posY'] = moveObj.dispChrToArrCol(secondChar)
            // }
        }


// moveObj['dest-posX'] = moveObj.dispRowToArrRow(moveObj['destination'][1])
// moveObj['dest-posY'] = moveObj.dispChrToArrCol(moveObj['destination'][0])

        return moveObj
    }

    createSingleMoveMap(turnNum, notation, teamNum) {

        const getLastTwoChar = ((string) => {
            return string.slice(-2);
        });
    
        const checkFirstLetter = ((string) => {
            if (string.charAt(0) === string.charAt(0).toUpperCase()) {return string.charAt(0)} else {return 'p'};
        });

        const dispRowToArrRow = ((number) => {
            const myDict = {1:7, 2:6, 3:5, 4:4, 5:3, 6:2, 7:1, 8:0};
            return myDict[Number(number)];
        });

        const countAlphaNumeric = ((string) => {
            if (typeof string ===! 'string') {throw new Error("countAlphaNumeric must be string")};
            return string.replace(/[^a-wyzA-WYZ0-9]/g, "").length;  // All letters and numbers except "x"
        });

        const letterToArrCol = ((string) => {
            if (typeof string ===! 'string') {throw new Error("letterToCol must be string")};
            const myDict = {'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'h':6, 'g':7};
            return myDict[string];
        });


        // code to find the addional file

        // code to find the addional rank

        // code if they both exist
    
        const chessMoveMap = new Map();
    
        chessMoveMap.set('turn-num', turnNum);
        chessMoveMap.set('notation', notation);
        chessMoveMap.set('notationClean', notation.replace(/[^a-zA-Z0-9]/g, ''));
        chessMoveMap.set('team-num', teamNum);
        chessMoveMap.set('piece', checkFirstLetter(notation));
        chessMoveMap.set('code', teamNum + checkFirstLetter(notation));
        chessMoveMap.set('is-castling', notation.includes('O-O'));
        chessMoveMap.set('is-capture', notation.includes('x'));
        chessMoveMap.set('is-checkormate', notation.includes('#'));
        chessMoveMap.set('is-promotion', notation.includes('='));
        chessMoveMap.set('file', getLastTwoChar(notation)[0]);
        chessMoveMap.set('rank', Number(getLastTwoChar(notation)[1]));
        chessMoveMap.set('destination', getLastTwoChar(chessMoveMap.get('notationClean')));
        chessMoveMap.set('dest-posX', dispRowToArrRow(chessMoveMap.get("destination")[1]));
        chessMoveMap.set('dest-posY', Number(chessMoveMap.get("destination")[0].charCodeAt(0) - 97)) - 1;
        chessMoveMap.set('location', null);
        chessMoveMap.set('loc-posX', null);
        chessMoveMap.set('loc-posY', null);
        chessMoveMap.set('castling-side', null);
    
        if (chessMoveMap.get('is-castling')) {
            if (notation === 'O-O') {chessMoveMap.set('castling-side', 'Kingside');};
            if (notation === 'O-O-O') {chessMoveMap.set('castling-side', 'Queenside');};
        }

        if (countAlphaNumeric(notation) === 4 ) {
            
            const secondChar = notation[1]

            if (!isNaN(secondChar)) {
                chessMoveMap.set('loc-posX', dispRowToArrRow(parseInt(secondChar, 10)));
            } else if (typeof secondChar === 'string') {
                chessMoveMap.set('loc-posY', letterToArrCol(secondChar));
            }

            // if (typeof secondChar === 'string') {
            //     chessMoveMap.set('loc-posY', letterToArrCol(notation[1]));
            // }
            // else if (typeof secondChar === 'number') {
            //     throw new Error ("aa")
            //     chessMoveMap.set('loc-posX', dispRowToArrRow(notation[1]));
            // };
        };

        if (chessMoveMap === null) {
            throw new Error(`notation: ${notation}  turnNum: ${turnNum}   teamNum: ${teamNum}  failed to create a map`);
        };

        // something for castling
        // if (chessMoveMap.set('is-castling')) {
        //     // throw new Error(`code required to castle`);
        // }

        // ensure letter is an allowed piece letter
        // if (chessMoveMap.get('piece'))

        return chessMoveMap;
    };

    printParserToTerminal() {
        console.log(`------Debug Parser Details------`);
        for (const [turn_num, movesArray] of Object.entries(this.cleanedMoves)) {
            console.log(`turn number: ${turn_num} | white: ${movesArray[0]} | black: ${movesArray[1]}`)
        };
        console.log(`-----------------------`);
    };

    printMapToTerminal(moveInfo) {
        console.log(`------Debug Move Map Details------`);
        console.log(`team-num: ${moveInfo.get('team-num')} | turn-num: ${moveInfo.get('turn-num')} | notation: ${moveInfo.get('notation')} | notationClean: ${moveInfo.get('notationClean')}`);
        console.log(`piece: ${moveInfo.get('piece')} | code: ${moveInfo.get('code')} | file: ${moveInfo.get('file')} | rank: ${moveInfo.get('rank')}`);
        console.log(`destination: ${moveInfo.get('destination')} | dest-posX: ${moveInfo.get('dest-posX')} | dest-posY: ${moveInfo.get('dest-posY')}`);
        console.log(`location: ${moveInfo.get('location')} | loc-posX': ${moveInfo.get('loc-posX')} | loc-posY: ${moveInfo.get('loc-posY')} | castling-side: ${moveInfo.get('castling-side')}`);
        console.log(`castling-side: ${moveInfo.get('castling-side')} | is-capture: ${moveInfo.get('is-capture')} | is-checkormate: ${moveInfo.get('is-checkormate')} | is-promotion: ${moveInfo.get('is-promotion')}`);
        console.log(`-----------------------`);
    };




    getMoveDetails(turnNum, teamNum) {
        // console.log(this.#moveInstructions)
        // return this.moveInstructions[turnNum][teamNum]
    }

    

    checkForErrors() {

    };

};

export default Parser;
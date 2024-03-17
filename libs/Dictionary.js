// Custom function to convert keys to strings
function defaultToString(key) {
    if (key === null) {
        return 'null';
    } else if (key === undefined) {
        return 'undefined';
    } else if (typeof key === 'string' || key instanceof String) {
        return key;
    } else {
        // For non-string keys, convert to a string representation
        return key.toString();
    };
};

class ValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    };
};

class Dictionary {
    constructor(toStrFn = defaultToString) {
        this.toStrFn = toStrFn;
        this.table = {};
    };

    hasKey(key) {
        return this.table[this.toStrFn(key)] != null;
    };

    set(key, value) {
        if (key != null && value != null) {
            const tableKey = this.toStrFn(key);
            this.table[tableKey] = new ValuePair(key, value);
            return true;
        }
        return false;
    };

    remove(key) {
        const tableKey = this.toStrFn(key);
        if (this.hasKey(key)) {
            delete this.table[tableKey];
            return true;
        }
        return false;
    };

    get(key) {
        const valuePair = this.table[this.toStrFn(key)];
        if (valuePair) {
            return valuePair.value;
        } else {
            throw new Error(`Key: ${key} does not exist in the dictionary`);
        }
    };

    keys() {
        return Object.keys(this.table);
    };

    values() {
        return Object.values(this.table).map(valuePair => valuePair.value);
    };

    keyValues() {
        return Object.values(this.table);
    };

    size() {
        return Object.keys(this.table).length;
    };

    isEmpty() {
        return this.size() === 0;
    };

    clear() {
        this.table = {};
    };

    // iterate over all key-value pairs in the dictionary and execute a callback function for each pair.
    forEach(callbackFn) {
        const valuePairs = this.keyValues();
        for (let i = 0; i < valuePairs.length; i++) {
            const result = callbackFn(valuePairs[i].key, valuePairs[i].value);
            if (result === false) {
                break;
            }
        }
    };

    //check if a given value exists in the dictionary.
    hasValue(value) {
        for (const key in this.table) {
            if (Object.hasOwnProperty.call(this.table, key)) {
                if (this.table[key].value === value) {
                    return true;
                }
            }
        }
        return false;
    };

    //return an array of key-value pairs as arrays.
    entries() {
        return Object.entries(this.table).map(([key, valuePair]) => [valuePair.key, valuePair.value]);
    };

    //merge another dictionary into the current dictionary.
    merge(dictionary) {
        dictionary.forEach((key, value) => {
            this.set(key, value);
        });
    };

    //return the dictionary as an array of key-value pairs.
    toArray() {
        return this.keyValues().map(valuePair => [valuePair.key, valuePair.value]);
    };

    //create a shallow copy of the dictionary.
    clone() {
        const clonedDictionary = new Dictionary();
        this.forEach((key, value) => {
            clonedDictionary.set(key, value);
        });
        return clonedDictionary;
    };

    getEntriesFromAttributes(attribute, searchword) {
        return Array.from(this.entries())
          .filter(([key, value]) => value[attribute].toLowerCase().includes(searchword.toLowerCase()))
          .map(([key, value]) => value);
    };
};

        //=================SEARCH DICTIONARY BY KEYWORD=================
        // const aa = 'ECO'
        // myResults = Array.from(this.dictionary.values(), obj => obj[aa]);
        // console.log(myResults)


// class ChessDictionary extends Dictionary {
//     constructor(toStrFn = defaultToString) {
//         super(toStrFn);
//     }

//     getEntriesFromAttribute(attribute, searchWord) {
//         return Array.from(this.entries())
//             .filter(([key, value]) => value[attribute].toLowerCase().includes(searchWord.toLowerCase()))
//             .map(([key, value]) => value);
//     };



//     getOpeningsWithE4OnFifthMove(dictionary) {
//         const openings = [];
//         for (const key in dictionary) {
//             if (dictionary.hasOwnProperty(key)) {
//                 const movesString = dictionary[key].MOVESSTRING;
//                 const moves = movesString.match(/\{(\d+) # (\S+) # (\S+)\}/g);
//                 if (moves.length >= 5 && moves[4].includes("# e4")) {
//                     openings.push(key);
//                 }
//             }
//         }
//         return openings;
//     }
    
// }


class ChessDictionary extends Dictionary {
    constructor(toStrFn = defaultToString) {
        super(toStrFn);


        // const test = "[{1 # d4 # f5}, {2 # c4 # e6}, {3 # Nf3 # Nf6}, {4 # g3 # c6}, {5 # Bg2 # d5}, {6 # O-O # Bd6}]";
        
    }

    updateWithMoveObj() {
        this.values().forEach(element => {
            const moveString = element['MOVESSTRING'];
    
            // Remove square brackets and split the string into an array of moves
            const movesArray = moveString.substring(1, moveString.length - 1).split("}, {");
    
            // Iterate through each move and split it by "||"
            const formattedMoves = movesArray.map(move => {
                // Remove curly braces and split by "||"
                const moveParts = move.replace(/[{}]/g, "").split("||").map(part => part.trim());
                return moveParts;
            });
    
            // Remove the first element from each array and replace empty strings with null
            const processedMoves = formattedMoves.map(move => {
                // If the second element is empty string, replace it with null
                if (move[1] === "") {
                    move[1] = null;
                }
                // If the third element is empty string, replace it with null
                if (move[2] === "") {
                    move[2] = null;
                }
                return move.slice(1); // Remove the first element
            });
    
            element[`MOVEOBJ`] = processedMoves;
        });
    };
  
    

    hasCapture(move) {
        // Iterate through each part of the move
        for (const part of move) {
            // If any part contains the character "x", return true
            if (part.includes("x")) {
                return true;
            }
        }
        // If no part contains "x", return false
        return false;
    }




    // const id = "A00"
    // result =  this.values().filter(({ ECO, VOLUME }) => ECO.includes(id) && VOLUME=="A");
    // console.log(result)
    // result =  this.values().filter(({ ECO, VOLUME }) => ECO.includes(id) && VOLUME=="A");


    filterCaptureOnSquare(ref, moveNum) {
        const isExists = (object) => object !== undefined && object !== null
        const isCapturedSquare = (string) => (string !== undefined && string !== null) ? (string.includes("x") && string.includes(`${ref}`)) : false;
        const results =this.values().filter(({ MOVEOBJ }) => {
            if(isExists(MOVEOBJ[moveNum-1])) {
                const array = Array.from(MOVEOBJ[moveNum-1].filter(n => n))
                return (isCapturedSquare(array[0]) || (isCapturedSquare(array[1])))
            }
        });
        return results
    };


    filterCheckOnSquare(ref, moveNum) {
        const isExists = (object) => object !== undefined && object !== null
        const isCheckedSquare = (string) => (string !== undefined && string !== null) ? (string.includes("+") && string.includes(`${ref}`)) : false;
        const results =this.values().filter(({ MOVEOBJ }) => {
            if(isExists(MOVEOBJ[moveNum-1])) {
                const array = Array.from(MOVEOBJ[moveNum-1].filter(n => n))
                return (isCheckedSquare(array[0]) || (isCheckedSquare(array[1])))
            }
        });
        return results
    };



    // filterCaptureOnMove(square, move) {
    //     return this.values().filter(({ MOVEOBJ }) => MOVEOBJ.some(([_, piece, dest]) => piece === square && dest === move));
    // };

    // case "CONTINUATION":
    //     result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["CONTINUATION"] && key.startsWith(searchItem)));
    //     break;
    // case "ALLCONTINUATIONS":
    //     result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["CONTINUATION"] && value['NUMMOVES'] >= moveNumber));
    //     break;



    
    // Example usage:
    // Assuming massiveList is your array of arrays
    // const uniqueArrays = getUniqueArrays(massiveList);
    // console.log(uniqueArrays);
    

    
    filterECO(eco) {
        return this.values().filter(({ ECO }) => ECO.includes(eco));
    };

    filterName(name) {
        return this.values().filter(({ NAME }) => NAME.includes(name));
    };

    filterFamily(family) {
        return this.values().filter(({ FAMILY }) => FAMILY.includes(family));
    };

    filterVariation(variation) {
        return this.values().filter(({ VARIATION }) => VARIATION.includes(variation));
    };

    filterSubVariation(subvariation) {
        return this.values().filter(({ SUBVARIATION }) => SUBVARIATION.includes(subvariation));
    };

    filterPGN(pgn) {
        return this.values().filter(({ PGN }) => PGN.startsWith(pgn));
    };

    filterNumMovesUnder(numMoves) {
        return this.values().filter(({ NUMMOVES }) => numMoves >= NUMMOVES);
    };

    filterNumMovesOver(numMoves) {
        return this.values().filter(({ NUMMOVES }) => numMoves <= NUMMOVES);
    };

    filterNumMovesBetween(lowerNum, higherNum) {
        return this.values().filter(({ NUMMOVES }) => lowerNum <= NUMMOVES && NUMMOVES <= higherNum);
    };
    
    filterNextMove(team) {
        return this.values().filter(({ NEXTTOMOVE }) => team === NEXTTOMOVE);
    };

    // filterNumMoves(numMoves) {
    //     return this.values().filter(({ NUMMOVES }) => numMoves > NUMMOVES);
    // };

    // filterCaptureOnTurn(team) {
    //     return this.values().filter(({ NEXTTOMOVE }) => team === NEXTTOMOVE);
    // };

};


export {Dictionary, ChessDictionary}
import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from './Piece.js';



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


    getState() {
        // Assuming state is represented by the current entries in the dictionary
        return Array.from(this.entries());
    };
};


class ChessDictionary extends Dictionary {
    constructor(toStrFn = defaultToString) {
        super(toStrFn);
    }

    // In the JSON file, there is a long PGN string seperated by "||"
    // This function unpacks that into an array of arrays
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



    // In the JSON file, there is ANOTHER long PGN string seperated by "||"
    // This function unpacks that into a board state.
    updateWithMoveState() {
        this.values().forEach(element => {
            const stateString = element['BOARDSTRING'];

            // Remove brackets and split by ' || '
            var boardArray = stateString.slice(1, -1).split(' || ');

            // Function to chunk the array into 8x8 grid
            function chunkArray(arr, size) {
                var result = [];
                for (var i = 0; i < arr.length; i += size) {
                    result.push(arr.slice(i, i + size));
                }
                return result;
            }

            // Convert to 2D array (8x8 grid)
            let chessboard = chunkArray(boardArray, 8);

            // Output the 2D array
            // console.log(chessboard);

            const modifiedChessboard = this.replaceWithPieces(chessboard);
            console.log(modifiedChessboard)

            
            // // Remove brackets and split by ' || '
            // let boardArray = stateString.slice(1, -1).split(' || ');

            // console.log(boardArray)



            // const modifiedChessboard = this.replaceWithPieces(boardArray);

            // // Output the modified chessboard array
            // console.log(modifiedChessboard);

            // // Function to chunk the array into 8x8 grid
            // function chunkArray(arr, size) {
            //     var result = [];
            //     for (var i = 0; i < arr.length; i += size) {
            //         result.push(arr.slice(i, i + size));
            //     }
            //     return result;
            // }

            // // Convert to 2D array (8x8 grid)
            // // var chessboard = chunkArray(boardArray, 8);

            // // // Output the 2D array
            // console.log(chessboard);
            })   
        };


    

    // Function to convert characters in the chessboard array to Piece objects
    convertToPiece(char) {
        switch (char) {
            case "1R":
                return new Rook(1); // Black Rook
            case "1N":
                return new Knight(1); // Black Knight
            case "1B":
                return new Bishop(1); // Black Bishop
            case "1Q":
                return new Queen(1); // Black Queen
            case "1K":
                return new King(1); // Black King
            case "1p":
                return new Pawn(1); // Black Pawn
            case "0R":
                return new Rook(0); // White Rook
            case "0N":
                return new Knight(0); // White Knight
            case "0B":
                return new Bishop(0); // White Bishop
            case "0Q":
                return new Queen(0); // White Queen
            case "0K":
                return new King(0); // White King
            case "0p":
                return new Pawn(0); // White Pawn
            case "-":
                return null; // Empty square
            default:
                throw new Error("Invalid character in chessboard array");
        }
    };

    // Function to replace characters in the chessboard array with Piece objects
    replaceWithPieces(chessboardArray) {
        // console.log(chessboardArray)
        return chessboardArray.map(row =>
            row.map(char => this.convertToPiece(char))
        );
    };
                
    
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

    filterPossibleMoves(moveNum, teamNum) {
        const b = this.values().map(({ MOVEOBJ }) => MOVEOBJ[moveNum] && MOVEOBJ[moveNum][teamNum]);
        const uniqueValues = new Set(b);
        return Array.from(uniqueValues);
    };

    filterContinuationsNext(id) {
        const nextContinuations = this.values().filter(({ ID }) => id === ID)[0]["CONTINUATIONSNEXT"];
        return this.values().filter(obj => nextContinuations.includes(obj.ID)); 
    };

    filterContinuationsFull(id) {
        const nextContinuations = this.values().filter(({ ID }) => id === ID)[0]["CONTINUATIONSFULL"];
        return this.values().filter(obj => nextContinuations.includes(obj.ID)); 
    };



    // filterCaptureOnTurn(team) {
    //     return this.values().filter(({ NEXTTOMOVE }) => team === NEXTTOMOVE);
    // };

};



class ChessMoves extends Dictionary {
    constructor(toStrFn = defaultToString) {
        super(toStrFn);
    }

    // Add a chess move to the dictionary
    addMove(moveNumber, move) {
        return this.set(moveNumber, move);
    }

    // Reverse the order of chess moves in the dictionary
    reverseMoves() {
        const reversedMoves = new ChessMoves(this.toStrFn);
        const moves = this.keyValues();
        for (let i = moves.length - 1; i >= 0; i--) {
            reversedMoves.addMove(moves.length - i, moves[i].value);
        }
        return reversedMoves;
    }
}





export {Dictionary, ChessDictionary}
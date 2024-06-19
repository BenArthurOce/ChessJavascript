const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Constants
const CSV_FILE_PATH = "E:/Users/Ben Arthur/Documents/Visual Studio Code/Javascript/git_ChessJavascript/ChessJavascript/data/chessCSV.csv";

// Translated regex pattern (JavaScript syntax)
const MOVE_REGEX =/\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?(?:#)?/g;


class OpeningsDict {
    constructor() {
        this.data = {};
        this.openingId = 1;
        this.readFromCsvFile();
    }

    readFromCsvFile() {
        fs.createReadStream(CSV_FILE_PATH)
            .pipe(csv())
            .on('data', (row) => {
                let pgn = row['PGN'].replace(/(\d+)\.\s+/g, '$1.');
                let eco = row['ECO'];
                let name = row['NAME'];
                let fen = row['FEN'];
                let board = row['BOARD'];

                this.data[fen] = {
                    ID: this.openingId,
                    FEN: fen,
                    ECO: eco,
                    VOLUME: eco[0],
                    NAME: name,
                    PGN: null,
                    MOVESSTRING: null,
                    BOARDSTRING: null,
                    NUMTURNS: null,
                    NUMMOVES: null,
                    NEXTTOMOVE: null,
                    FAMILY: null,
                    VARIATION: null,
                    SUBVARIATION: null,
                    CHECKMATE: null,
                    CASTLINGWHITE: null,
                    CASTLINGBLACK: null,
                    CONTINUATIONSNEXT: [],
                    CONTINUATIONSFULL: [],
                    FAVOURITE: null,
                    ISERROR: null,
                    COMMON: null
                };

                //
                // REGEX
                //
                // console.log(`------${this.openingId}--------`)
                const splitNotation = row['PGN'].split(MOVE_REGEX).filter(a => a !== '');

                //
                // REGEX, SET UP MOVES
                //
                const moves = {};
                for (let x = 0; x < splitNotation.length; x += 3) {
                    const key = parseInt(splitNotation[x].replace('.', ''));
                    const value = [splitNotation[x + 1], splitNotation[x + 2]];
                    moves[key] = value;
                };

                const keys = Object.keys(moves);

                //
                // ID NUMBER
                //
                this.openingId++;

                //
                // MOVESSTRING
                //
                let formattedGame = '[' + Object.keys(moves)
                .map(key => `{${key} || ${moves[key].filter(move => move !== undefined).join(' || ')}}`)
                .join(', ') + ']';
                this.data[fen]['MOVESSTRING'] = `${formattedGame}`;

                //
                // PGN
                //
                const objectStrings = formattedGame.slice(1, -1).split('}, {').map(str => str.replace(/[{}]/g, ''));

                // Process each object string to extract the move numbers and moves
                const transformedMoves = objectStrings.map(objStr => {
                    const parts = objStr.split(' || ').map(part => part.trim());
                    const moveNumber = parts[0];
                    const moves = parts.slice(1).join(' ');
                    return `${moveNumber}.${moves}`;
                });

                this.data[fen]['PGN'] = transformedMoves.join(' ')


                //
                // BOARDSTRING
                //
                this.data[fen]['BOARDSTRING'] = row['BOARD'].replace(/,/g, ' || ');

                //
                // NUMTURNS
                //
                this.data[fen]['NUMTURNS'] = keys.length

                //
                // NUMMOVES
                //
                let count = 0;
                for (let key in moves) {
                  if (moves.hasOwnProperty(key)) {
                    for (let move of moves[key]) {
                      if (move !== undefined) {
                        count++;
                      }
                    }
                  }
                }
                this.data[fen]['NUMMOVES'] = count

                //
                // NEXTTOMOVE
                //
                let lastMove = moves[keys.length][1];
                this.data[fen]['NEXTTOMOVE'] = lastMove === undefined ? 'Black' : 'White';

                //
                // FAMILY / VARIATION / SUBVARIATION
                //
                let splitTest = name.split(/: |; /);
                this.data[fen]['FAMILY'] = splitTest[0] || null;
                this.data[fen]['VARIATION'] = splitTest[1] || null;
                this.data[fen]['SUBVARIATION'] = splitTest[2] || null;

                //
                // CHECKMATE
                //
                this.data[fen]['CHECKMATE'] = pgn.includes('#');

                //
                // CASTLINGWHITE / CASTLINGBLACK
                //
                // Object.keys(moves).forEach(key => {
                //     const move = moves[key];
                    
                //     if (move && move.includes('O-O')) {
                //       if (move.indexOf('O-O') === 1) {
                //         if (!this.data[key]) {
                //           this.data[key] = {};
                //         }
                //         this.data[key]['CASTLINGWHITE'] = 'Kingside';
                //       } else if (move.indexOf('O-O') === 0) {
                //         if (!this.data[key]) {
                //           this.data[key] = {};
                //         }
                //         this.data[key]['CASTLINGBLACK'] = 'Kingside';
                //       }
                //     } else if (move && move.includes('O-O-O')) {
                //       if (move.indexOf('O-O-O') === 1) {
                //         if (!this.data[key]) {
                //           this.data[key] = {};
                //         }
                //         this.data[key]['CASTLINGWHITE'] = 'Queenside';
                //       } else if (move.indexOf('O-O-O') === 0) {
                //         if (!this.data[key]) {
                //           this.data[key] = {};
                //         }
                //         this.data[key]['CASTLINGBLACK'] = 'Queenside';
                //       }
                //     }
                //   });
                  
            })
            .on('end', () => {
                // this.addContinuations();
                this.compareAllBoardStates();
                this.createJsonFile(this.data, 'openings_data.json');
            });
    }


    // Function to compare all board states in openingsData
    compareAllBoardStates() {
        console.log("FUNCTION: compareAllBoardStates")

        // Assuming this.data is your object containing the boards
        Object.entries(this.data).forEach(([key1, value1]) => {
            // Extract board string from the first entry
            let continuations = []
            let board1 = value1["BOARDSTRING"];
            let NUMTURNS1 = parseInt(value1["NUMTURNS"]);
            let NUMMOVES = parseInt(value1["NUMMOVES"]);


            // Filter moves where the next player to move is white, and the move number is increased by 1
            const filteredMoves1 = Object.entries(this.data).filter(([_, value2]) => {
                return parseInt(value2["NUMMOVES"]) === NUMMOVES + 1;
            });

            // const filteredMoves2 = Object.entries(this.data).filter(([_, value2]) => {
            //     return parseInt(value2["NUMTURNS"]) === NUMTURNS1 + 1 && value2["NEXTTOMOVE"] === "Black";
            // });

            // const filteredMoves3 = Object.entries(this.data).filter(([_, value2]) => {
            //     return parseInt(value2["NUMMOVES"]) === NUMMOVES + 1;
            // });
        
            // // Filter entries where NUMTURNS is NUMTURNS1 + 1
            // const filteredMoves1 = Object.entries(this.data).filter(([_, value2]) => {
            //     return parseInt(value2["NUMTURNS"]) === NUMTURNS1 + 1;
            // });

            // const filteredMoves2 = Object.entries(this.data).filter(([_, value2]) => {
            //     return parseInt(value2["NUMTURNS"]) === NUMTURNS1 && value2["NEXTTOMOVE"] === "Black";
            // });

            // Combine the results of both filters
            // const combinedFilteredMoves = filteredMoves1.concat(filteredMoves2);
        
            // Iterate through the filtered moves to compare against all other boards
            filteredMoves1.forEach(([key2, value2]) => {
                // Extract board string from the second entry
                let board2 = value2["BOARDSTRING"];
        
                // Ensure not comparing the same board with itself
                if (key1 !== key2) {
                    // Perform your comparison function here (this.compareTwoBoardStates)
                    let comparisonResult = this.compareTwoBoardStates(board1, board2);
        
                    if (comparisonResult) {
                        // console.log(`${value1["ID"]} and ${value2["ID"]} are similar`);
                        continuations.push(value2["ID"])
                    }
                }
            });
            this.data[key1]['CONTINUATIONSNEXT'] = continuations;
        });
    }

        // Object.entries(this.data).forEach(([key, value]) => {
        //     // console.log(`Key: ${key}, Value: ${value}`);
        //     let board1 = value["BOARDSTRING"]
        //     console.log(value)
        //   });

    /**
     * Takes the two board states represented as strings, splits them into 2d arrays and counts the number of differences
     * If the two boards are a standard move away from each other, the number should be 2 (castling 4)
     * @param {String} board1 The first chessboard, represented as a string. Squares are seperated by "||"
     * @param {String} board2 The second chessboard, represented as a string. Squares are seperated by "||"
     */    
    compareTwoBoardStates(board1, board2) {

        // console.log(board1)
        // console.log(board2)

        const arr1 = board1.split(" || ");
        const arr2 = board2.split(" || ");
        // Determine the length of the longer array
        const maxLength = Math.max(arr1.length, arr2.length);
        let nonMatchingCount = 0;
    
        // Loop through the elements of both arrays up to the length of the longer array
        for (let i = 0; i < maxLength; i++) {
            // Compare elements at the same position in both arrays
            if (arr1[i] !== arr2[i]) {
                nonMatchingCount++;
            }
        }

        return nonMatchingCount == 2
    

    }

    addContinuations() {



        Object.entries(this.data).forEach(([key, value]) => {
            // console.log(`Key: ${key}, Value: ${value}`);

            let board1 = value["BOARDSTRING"]



            // console.log(value)
          });


    }

    createJsonFile(data, filename) {
        fs.writeFile(filename, JSON.stringify(data, null, 4), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }
}

console.log("START: script_CSVparsetoJSON");

// Instantiate the class to start the process
const openingsDict = new OpeningsDict();

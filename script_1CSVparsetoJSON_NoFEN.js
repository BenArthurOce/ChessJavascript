const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Constants
const CSV_FILE_PATH = "E:/Users/Ben Arthur/Documents/Visual Studio Code/Javascript/git_ChessJavascript/ChessJavascript/data/ChessOpeningsNoFEN.csv";
const JSON_FILE_PATH = "E:/Users/Ben Arthur/Documents/Visual Studio Code/Javascript/git_ChessJavascript/ChessJavascript/data/openings_no_fen.json";


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

                this.data[pgn] = {
                    ID: this.openingId, 
                    ECO: eco,
                    VOLUME: eco[0],
                    NAME: name,
                    FULL: null,
                    PGN: null,
                    MOVESSTRING: null,
                    NUMTURNS: null,
                    NUMMOVES: null,
                    NEXTTOMOVE: null,
                    FAMILY: null,
                    VARIATION: null,
                    SUBVARIATION: null,
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
                this.data[pgn]['MOVESSTRING'] = `${formattedGame}`;

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

                this.data[pgn]['PGN'] = transformedMoves.join(' ')

                //
                // FULL
                //
                this.data[pgn]['FULL'] = eco + " - " + name

                //
                // NUMTURNS
                //
                this.data[pgn]['NUMTURNS'] = keys.length

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
                this.data[pgn]['NUMMOVES'] = count

                //
                // NEXTTOMOVE
                //
                let lastMove = moves[keys.length][1];
                this.data[pgn]['NEXTTOMOVE'] = lastMove === undefined ? 'Black' : 'White';

                //
                // FAMILY / VARIATION / SUBVARIATION
                //
                let splitTest = name.split(/: |; /);
                this.data[pgn]['FAMILY'] = splitTest[0] || null;
                this.data[pgn]['VARIATION'] = splitTest[1] || null;
                this.data[pgn]['SUBVARIATION'] = splitTest[2] || null;

                //
                // FAMILY ECO
                //
                this.data[pgn]['ECOFAMILY'] = this.data[pgn]['ECO'] + " - " + this.data[pgn]['FAMILY']
                  
            })
            .on('end', () => {
                this.createJsonFile(this.data, JSON_FILE_PATH);
            });
    };


    createJsonFile(data, filename) {
        // Ensure directory exists before writing the file
        const directory = path.dirname(filename);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        fs.writeFile(filename, JSON.stringify(data, null, 4), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }
}

console.log("START: script_CSVparsetoJSON");

// Instantiate the class to start the process
const openingsDict = new OpeningsDict();

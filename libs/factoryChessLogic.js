import Parser from "./factoryChessParser.js";
import Board from "./factoryChessBoard.js";
import {
    Piece
    , Pawn
    , Rook
    , Knight
    , Bishop
    , Queen
    , King
} from "./factoryChessPiece.js";

// The main goal here is to get the "starting position" of the ChessParse Map.
// Then we have the starting location, and the destination

class Logic {
    #gameNotation
    #parser
    #gameBoard
    constructor(gameNotation) {
        this.#gameNotation = gameNotation; // Single string of chess PGN. Details all the moves.
        this.#parser = new Parser(gameNotation); // Details of every move in Map() format
        this.#gameBoard = new Board() // Contains Square() objects, which contain Piece() objects
    };
    get gameNotation() {
        return this.#gameNotation;
    };
    set gameNotation(value) {
        return this.#gameNotation;
    };
    get parser() {
        return this.#parser;
    };
    set parser(value) {
        this.#parser = value;
    };
    get gameBoard() {
        return this.#gameBoard;
    };
    set gameBoard(value) {
        this.#gameBoard = value;
    };

    processMoves() {
        this.parser.printParserToTerminal()

        for (const [turn_num, movesArray] of Object.entries(this.parser)) {
            const white_move_instructions = this.getMoveDetail(turn_num, 0);
            const black_move_instructions = this.getMoveDetail(turn_num, 1);

            this.parser.printMapToTerminal(white_move_instructions);
            this.parser.printMapToTerminal(black_move_instructions);
            // console.log(movesArray)

            console.log()
            if (!white_move_instructions) {
                throw new TypeError(`turn_num: ${turn_num} | white move instructions failed to return`);
            };

            if (!black_move_instructions) {
                throw new TypeError(`turn_num: ${turn_num} | black move instructions failed to return`);
            };




            let exit_castling = false

            if (white_move_instructions.get("is-castling") && white_move_instructions.get("castling-side") === "Kingside") {
                // Perform castling
                exit_castling = true;
                this.gameBoard.performCastlingKingside(0);
            };
    
            if (white_move_instructions.get("is-castling") && white_move_instructions.get("castling-side") === "Queenside") {
                // Perform castling
                exit_castling = true;
                this.gameBoard.performCastlingQueenside(0);
            };

            if (black_move_instructions.get("is-castling") && black_move_instructions.get("castling-side") === "Kingside") {
                // Perform castling
                exit_castling = true;
                this.gameBoard.performCastlingKingside(1);
            };
    
            if (black_move_instructions.get("is-castling") && black_move_instructions.get("castling-side") === "Queenside") {
                // Perform castling
                exit_castling = true;
                this.gameBoard.performCastlingQueenside(1);
            };

            if (exit_castling) {continue}



            const whiteLocation = this.findLocation(white_move_instructions, 0);
            const blackLocation = this.findLocation(black_move_instructions, 1);

            if (whiteLocation === null) {
                throw new TypeError(`turn_num ${turn_num} for white returned null`);
            };

            if (blackLocation === null) {
                throw new TypeError(`turn_num ${turn_num} for black returned null`);
            };

            const whiteX = white_move_instructions.get("dest-posX");
            const whiteY = white_move_instructions.get("dest-posY");
            const blackX = black_move_instructions.get("dest-posX");
            const blackY = black_move_instructions.get("dest-posY");

            const white_piece_to_move = this.gameBoard.returnPieceFromBoardPosition(whiteLocation[0], whiteLocation[1]);
            const black_piece_to_move = this.gameBoard.returnPieceFromBoardPosition(blackLocation[0], blackLocation[1]);

            //move white
            this.gameBoard.removePieceFromBoard(whiteLocation[0], whiteLocation[1]);
            this.gameBoard.putPieceOnBoard(whiteX, whiteY, white_piece_to_move);

            //move black
            this.gameBoard.removePieceFromBoard(blackLocation[0], blackLocation[1]);
            this.gameBoard.putPieceOnBoard(blackX, blackY, black_piece_to_move);

            // update pieces
            this.gameBoard.updatePiecePositions();

        };
    };

    getMoveDetail(turnNum, teamNum) {
        return this.parser[turnNum][teamNum];
    };


    findLocation(moveInst, teamNum) {
        // this.parser.printMapToTerminal(moveInst);
        let result = null

        // this.parser.printMapToTerminal(moveInst);



        // if (result !== null) {return result};

        const letter = moveInst.get("piece");
        if (letter === null) {
            throw new Error("findLocation failed to return a piece letter");
        };

        const moveMap = new Map();

        moveMap.set('p', Pawn);
        moveMap.set('R', Rook);
        moveMap.set('N', Knight);
        moveMap.set('B', Bishop);
        moveMap.set('Q', Queen);
        moveMap.set('K', King);


        // // these are just used for debugging
        const destCoord = [moveInst.get("dest-posX"), moveInst.get("dest-posY")];
        const moveNum = moveInst.get("turn-num");
        const teamNum2 = moveInst.get("team-num");
        const dest = moveInst.get("destination");
        const notation = moveInst.get("notation");

        const searchItem = moveMap.get(letter);

        if (!searchItem) {
            throw new Error(`Piece not found for letter: ${letter}`
                , this.parser.printMapToTerminal(moveInst)
            );
        };

        // This returns a list of possible pieces that could have moved to that square
        const possiblePieces = this.gameBoard.filterBoardByPiece(searchItem, teamNum)
        

        // If the notation has a doubled up file or rank
        if (Number.isInteger(moveInst.get("loc-posY")) || Number.isInteger(moveInst.get("loc-posX"))) {
            
            const posX = moveInst.get("loc-posX");
            const posY = moveInst.get("loc-posY");

            possiblePieces.forEach(piece => {
                piece.printToTerminal()
                if (piece.row === posX) {
                    result = piece.arrPos;
                    return;
                } else if (piece.col === posY) {
                    result = piece.arrPos;
                    return;
                };
            });
            if (result !== null) {return result};
        };
        

        possiblePieces.forEach(piece => {
            const legalMoves = piece.findLegalMoves();

            legalMoves.forEach(legalMove => {
                if (legalMove[0] == destCoord[0] && legalMove[1] == destCoord[1]) {
                    result = piece.arrPos;
                    return;
                };
            });
        });

        // If a matching legal move was found, return it. Otherwise throw error
        if (result !== null) {
            return result;
        } else {
            throw new Error(
                `notation: ${notation}  destCoord: ${destCoord}   moveNum: ${moveNum}  teamNum: ${teamNum} returned no match`
                , this.gameBoard.printToTerminal()
                , console.log(possiblePieces)
            );
        };
    };
};

export default Logic;
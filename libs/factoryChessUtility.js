class ChessUtility {
    static #rowRefToArray = { 8: 0, 7: 1, 6: 2, 5: 3, 4: 4, 3: 5, 2: 6, 1: 7, 0: 8 };
    static #rowArrayToRefMap = { 0: 8, 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1, 8: 0 };
    static #colRefToArray = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 };
    static #colArrayToRefMap = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h' };

    static rowArrayToRef(boardValue) {
        return this.#rowArrayToRefMap[boardValue];
    }

    static rowRefToArray(rowValue) {
        return this.#rowRefToArray[rowValue];
    }

    static colRefToArray(boardValue) {
        return this.#colRefToArray[boardValue];
    }

    static colArrayToRef(colValue) {
        return this.#colArrayToRefMap[colValue];
    }

    static chessRefToArrayPos(chessRef) {
        const col = ChessUtility.#colRefToArray[chessRef[0]];
        const row = ChessUtility.#rowRefToArray[chessRef[1]];
        return [row, col];
    }

    static arrayPosToChessRef(arrayPos) {
        const col = ChessUtility.#colArrayToRefMap[arrayPos[0]];
        const row = ChessUtility.#rowArrayToRefMap[arrayPos[1]];
        return `${col}${row}`;
    }
}

export default ChessUtility;

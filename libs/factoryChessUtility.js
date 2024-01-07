class ChessUtility {
    static #rowRefToArray = { 8: 0, 7: 1, 6: 2, 5: 3, 4: 4, 3: 5, 2: 6, 1: 7};
    static #rowArrayToRefMap = { 0: 8, 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1};
    static #colRefToArray = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 };
    static #colArrayToRefMap = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h' };

    static rowArrayToRef(rowArray) {
        return this.#rowArrayToRefMap[rowArray];
    }

    static rowRefToArray(rowRef) {
        return this.#rowRefToArray[rowRef];
    }

    static colArrayToRef(colArray) {
        return this.#colArrayToRefMap[colArray];
    }

    static colRefToArray(colRef) {
        return this.#colRefToArray[colRef];
    }
z
    static chessRefToArrayPos(positionRef) {
        const col = ChessUtility.#colRefToArray[positionRef[0]];
        const row = ChessUtility.#rowRefToArray[positionRef[1]];
        return [row, col];
    }

    static arrayPosToChessRef(arrayRef) {
        const col = ChessUtility.#colArrayToRefMap[arrayRef[1]];
        const row = ChessUtility.#rowArrayToRefMap[arrayRef[0]];
        return `${col}${row}`;
    }
}

export default ChessUtility;

class DictionarySearchStrategy {
    search(dictionary, criteria) {
        throw new Error('This method should be overridden!');
    };
};


class SearchByKeyStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        return dictionary[criteria.key] || null;
    };
};


class SearchByValueStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        return dictionary.keys().find(key => dictionary[key] === criteria.value) || null;
    };
};


// Search Strategy for ID
class SearchByIdStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        return dictionary.values().find(entry => entry.ID === criteria.ID) || null;
    };
};


// Search Strategy for FEN
class SearchByFENStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        return dictionary.values().filter(entry => entry.FEN === criteria.FEN)[0];
    };
};


// Search Strategy for ECO
class SearchByECOStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        return dictionary.values().filter(entry => entry.ECO === criteria.ECO);
    };
};


// Search Strategy for NAME
class SearchByNameStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        return dictionary.values().filter(entry => entry.NAME.includes(criteria.NAME));
    };
};


// Search Strategy for NUMMOVES
class SearchByNumMovesStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        const numMoves = parseInt(criteria.NUMMOVES);
        return dictionary.values().filter(entry => entry.NUMTURNS === numMoves);
    };
};


// Search Strategy for NUMTURNS
class SearchByNumTurnsStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        const numTurns = parseInt(criteria.NUMTURNS);
        return dictionary.values().filter(entry => entry.NUMTURNS === numTurns);
    };
};


// Search Strategy for CONTINUATIONSNEXT
class SearchByContinuationsNextStrategy extends DictionarySearchStrategy {
    search(dictionary, criteria) {
        const opening = dictionary.values().find(entry => entry.ID === criteria.ID);
        return opening.CONTINUATIONSNEXT
    };
};


export {
    DictionarySearchStrategy,
    SearchByKeyStrategy,
    SearchByValueStrategy,
    SearchByIdStrategy,
    SearchByFENStrategy,
    SearchByECOStrategy,
    SearchByNameStrategy,
    SearchByNumTurnsStrategy,
    SearchByNumMovesStrategy,
    SearchByContinuationsNextStrategy
}
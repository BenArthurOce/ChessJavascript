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
        console.log(valuePair)
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




export default Dictionary
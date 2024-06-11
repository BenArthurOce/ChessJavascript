class StaticOpeningDatabase {
    static openings = {};

    static fetchOpeningsData() {
        return fetch('./data/openings_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.openings = data;
            })
            .catch(error => {
                console.error(error.message);
            });
    }

    static async initialize() {
        try {
            await this.fetchOpeningsData();
        } catch (error) {
            console.error(error.message);
        }
    }

    /**
     * Filters the dictionary based on specified criteria.
     * @param {string} searchCategory - The category to search in (e.g., "PGN", "MOVESTART", "ECO").
     * @param {string} searchItem - The item to search for within the specified category.
     * @param {number|null} moveNumber - Optional. The move number to further filter the results.
     * @returns {Object} - The filtered dictionary containing matching entries.
     * @throws {Error} - Throws an error if the search category is not valid, no entries are found, or no entries match the specified move number.
     */
    static filterOpeningDict(searchCategory, searchItem, moveNumber) {
        let result = {};

        switch (searchCategory.toUpperCase()) {
            case "EVERYTHING":
                result = Object.fromEntries(Object.entries(this.openings))
                console.log(this.openings)
                break
            case "PGN":
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => key === searchItem));
                break;
            case "MOVESTART":
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => key.startsWith(searchItem) && !value["ERROR"]));
                break;
            case "ECO":
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["ECO"] === searchItem.toUpperCase() && !value["ERROR"]));
                console.log(result)
                break;
            case "VOLUME":
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["VOLUME"] === searchItem));
                break;
            case "NAME":
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["NAME"].includes(searchItem)));
                console.log(result)
                break;
            case "CONTINUATION":
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["CONTINUATION"] && key.startsWith(searchItem)));
                break;
            case "ALLCONTINUATIONS":
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["CONTINUATION"] && value['NUMMOVES'] >= moveNumber));
                break;
            case "FAVOURITE":
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["FAVOURITE"]));
                break;
            case "MOVENUMBER":
                searchItem = parseInt(searchItem);
                result = Object.fromEntries(Object.entries(this.openings).filter(([key, value]) => value["NUMMOVES"] === searchItem && value["CONTINUATION"]));
                break;
            default:
                throw new Error(`Search category: ${searchCategory} is not a valid search term`);
        };

        // Filter out error'd openings
        result = Object.fromEntries(Object.entries(result).filter(([key, value]) => !value["ERROR"]));

        // Throw error if no entries found after filtering errors
        if (Object.keys(result).length === 0) {
            throw new Error("No Entries found when filtering the dictionary");
        }

        // // if user nominated a turn number, filter further to find dictionary lines containing that turn number
        // if (moveNumber !== null) {
        //     result = Object.fromEntries(
        //         Object.entries(result).filter(([key, value]) => {
        //             const moves = value['PGN'];
        //             return moves && moves.includes(` ${moveNumber}.`);
        //         })
        //     );
        // }

        // // Throw error if no entries found for the specified move number
        // if (Object.keys(result).length === 0) {
        //     throw new Error(`There are no entries for turn ${moveNumber} when searching for ${searchItem} as a ${searchCategory}`);
        // }

        return result;
    }
}

// Initialize the static variable openings
StaticOpeningDatabase.initialize();

export default StaticOpeningDatabase;
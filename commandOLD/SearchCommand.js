class SearchCommand {
    constructor(frontPage, category, searchWord) {
        this.frontPage = frontPage;
        this.category = category;
        this.searchWord = searchWord;
        this.previousState = null;
    }

    execute() {
        // Save the previous state for undo functionality
        this.previousState = this.frontPage.chessDictionary.getState();

        // Perform the search operation
        const searchResult = this.frontPage.filterDictionary(this.category, this.searchWord);

        // Do something with the search result (e.g., update UI)
        // Example: this.frontPage.updateUI(searchResult);
    }

    undo() {
        if (this.previousState) {
            this.frontPage.chessDictionary.restoreState(this.previousState);
            // Example: this.frontPage.updateUI(this.previousState);
        }
    }
}

export default SearchCommand;

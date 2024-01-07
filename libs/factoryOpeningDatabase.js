class OpeningDatabase {
    constructor() {
        this.openings = {};
        this.initClass();
    }

    initClass() {
        fetch('./data/chessOpenings.json')
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
}

export default OpeningDatabase;
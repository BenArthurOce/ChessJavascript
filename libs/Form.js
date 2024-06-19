class Form {
    constructor() {
        this.formData = null
    }

    eventMethod(callback) {
        console.log(`Func: eventMethod`)
        console.log(this.formData)
        let popup = new Popup();
        popup.fire((values) => this.endMethod(values, callback));
    }

    endMethod(values, callback) {
        console.log(`Func: endMethod`)
        console.log(values)
        console.log(callback)
        callback(values); // Pass the form data to the callback function
    }
}

class Popup {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        this.overlay.style.display = 'none';
        document.body.appendChild(this.overlay);

        this.okayButton = document.createElement('button');
        this.okayButton.textContent = 'Search';
        this.okayButton.addEventListener('click', () => this.handleSearch());

        // Add keypress event listener to the overlay
        this.overlay.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Callback function for when the search is triggered
        this.searchCallback = null;
    }

    handleSearch() {
        const ecoInput = document.getElementById('ecoInput').value;
        const nameInput = document.getElementById('nameInput').value;
        const familyInput = document.getElementById('familyInput').value;
        const variationInput = document.getElementById('variationInput').value;
        const pgnInput = document.getElementById('pgnInput').value;
        const NUMTURNSInput = document.getElementById('NUMTURNSInput').value;
        const nextMoveInput = document.getElementById('nextMoveInput').value;
        const captureSquareInput = document.getElementById('NUMTURNSInput').value;
        const captureTurnInput = document.getElementById('nextMoveInput').value;

        const formData = {
            eco: ecoInput,
            name: nameInput,
            family: familyInput,
            variation: variationInput,
            pgn: pgnInput,
            NUMTURNS: NUMTURNSInput,
            nextMove: nextMoveInput,
            captureSquare: captureSquareInput,
            captureTurn: captureTurnInput,
        };

        if (this.searchCallback) {
            this.searchCallback(formData);
            this.overlay.style.display = 'none';
        }
    }



    fire(callback) {
        console.log("Func: fire");
        this.searchCallback = callback;

        this.overlay.style.display = 'block';
        this.overlay.innerHTML = `
            <label for="ecoInput">ECO:</label>
            <input type="text" id="ecoInput"><br>
            <label for="nameInput">Name:</label>
            <input type="text" id="nameInput"><br>
            <label for="familyInput">Family:</label>
            <input type="text" id="familyInput"><br>
            <label for="variationInput">Variation:</label>
            <input type="text" id="variationInput"><br>
            <label for="pgnInput">PGN:</label>
            <input type="text" id="pgnInput"><br>
            <label for="NUMTURNSInput">Number of Moves:</label>
            <input type="text" id="NUMTURNSInput"><br>
            <label for="nextMoveInput">Next Move Team:</label>
            <input type="text" id="nextMoveInput"><br>
            <label for="captureOnSquare">Capture on Square:</label>
            <input type="text" id="captureOnSquare"><br>
            <label for="captureOnTurn">Capture on Turn:</label>
            <input type="text" id="captureOnTurn"><br>
        `;
        this.overlay.appendChild(this.okayButton);
    }
};

export {Form, Popup}


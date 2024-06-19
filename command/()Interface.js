class Interface {
    constructor() {
    }

    // Define a placeholder for execute method
    execute(...args) {
        throw new Error("Method 'execute' must be implemented.");
    }
}

export default Interface
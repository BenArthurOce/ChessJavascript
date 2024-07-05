class GameSubject {
    constructor() {
        this.observers = [];
    }

    attach(observer) {
        this.observers.push(observer);
    }

    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(fen) {
        this.observers.forEach(observer => observer.update(fen));
    }
}

export default GameSubject;
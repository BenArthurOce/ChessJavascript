class BoardSubject {
    constructor() {
        this.observers = [];
    }

    registerObserver(observer) {
        this.observers.push(observer);
    }

    unregisterObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}

export default BoardSubject;

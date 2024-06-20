class DictionarySearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  search(dictionary, criteria) {
    return this.strategy.search(dictionary, criteria);
  }
  }
  
export default DictionarySearchContext
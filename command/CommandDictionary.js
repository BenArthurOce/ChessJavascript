class CommandDictionary {
    execute() {
      throw new Error('This method should be overridden!');
    }
  }
  

  class AddDictionaryCommand extends CommandDictionary {
    constructor(dictionary, key, value) {
      super();
      this.dictionary = dictionary;
      this.key = key;
      this.value = value;
    }
  
    execute() {
      this.dictionary[this.key] = this.value;
    }
  }
  
  class RemoveDictionaryCommand extends CommandDictionary {
    constructor(dictionary, key) {
      super();
      this.dictionary = dictionary;
      this.key = key;
    }
  
    execute() {
      delete this.dictionary[this.key];
    }
  }
  
  class UpdateDictionaryCommand extends CommandDictionary {
    constructor(dictionary, key, value) {
      super();
      this.dictionary = dictionary;
      this.key = key;
      this.value = value;
    }
  
    execute() {
      if (this.key in this.dictionary) {
        this.dictionary[this.key] = this.value;
      } else {
        throw new Error(`Key ${this.key} does not exist in the dictionary.`);
      }
    }
  }
  
  class GetDictionaryCommand extends CommandDictionary {
    constructor(dictionary, key) {
      super();
      this.dictionary = dictionary;
      this.key = key;
    }
  
    execute() {
      return this.dictionary[this.key];
    }
  }
  
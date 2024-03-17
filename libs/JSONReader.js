
// I lifted this straight from chatGPT because I was getting frusturated with async/await
class JSONReader {
    constructor(filePath) {
      this.filePath = filePath;
      this.data = null;
    }
  
    readJSONSync() {
      const xhr = new XMLHttpRequest();
      xhr.overrideMimeType('application/json');
      xhr.open('GET', this.filePath, false); // false makes the request synchronous
      xhr.send(null);
  
      if (xhr.status === 200) {
        this.data = JSON.parse(xhr.responseText);
      } else {
        console.error('Failed to load JSON file:', xhr.status);
      }
    }
  
    getData() {
      return this.data;
    }
  }
  
//   // Example usage:
//   const jsonReader = new JSONReader('data.json');
//   jsonReader.readJSONSync();
  
//   // Accessing data
//   const jsonData = jsonReader.getData();
//   console.log(jsonData);


export default JSONReader
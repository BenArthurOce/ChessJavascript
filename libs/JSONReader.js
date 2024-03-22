class JSONReader {
  constructor(filePath) {
      this.filePath = filePath;
  }

  async readJSON() {
      try {
          const response = await fetch(this.filePath);
          if (!response.ok) {
              throw new Error(`Failed to fetch JSON file: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          console.error('Error reading JSON file:', error);
          return null;
      }
  }
}

export default JSONReader;

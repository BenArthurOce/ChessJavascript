
// import FrontPage from "./libs/FrontPageUsingLogic.js";
import FrontPageUsingFEN from "./libs/FrontPageUsingFEN.js";

// wishlist
// code that would reject a notation and only accept information
// code that can look up information based on notation
// Should i make a subclass of the dictionary, where it only contains chess openings?

// I've managed to create the actual board positions for each opening. I've essentally removed all need for the logic to even be in there.



// More wishlist
// cleaner "init" on other classes (Square, Piece)
// Delete old files
// Interactive Board that creates a board pgn
// More JSON data for castling data
// Successful gambits
//


// class Rectangle {
//     #height = 20;
//     #width;
//     constructor( width) {
//     //   this.#height 
//       this.#width = width;
//     }
//   }
  
// const a = new Rectangle()
// console.log(a)

// const frontpage = new FrontPage()
const frontpage = new FrontPageUsingFEN()
# Ben Arthur - Chess opening navigation on Javascript

**Chess Website on Javascript**
Openings sourced from: [Lichess Chess Openings](https://github.com/lichess-org/chess-openings)

Data structure can be divided into two parts:

## Part 1: Data

**1a:** JSONReader

**1b:** Dictionary

**1c:** StaticChessParser

**1d:** StaticOpeningDatabase

## Part 2: Logic and Display

**2a:** FrontPage

**2b:** Game

**2c:** Board

**2d:** Square

**2e:** Piece

**2f:** StaticChessUtility

**2g:** StaticErrorCheck

**2h:** StaticGameLogic

## Rough Summary

The chess dictionary of openings is created by `JSONReader()` and `Dictionary()`. Held by `FrontPage()` which makes a series of `Game()` objects based on the information from `Dictionary()`
In order to determine how the opening position looks like for each opening, we take the opening string, get information using `StaticChessParser()`, and then that information is used by `StaticGameLogic()` to move pieces on the board

## Data

### 1a: JSONReader

wip
Note: PGN = Portable Game Notation

### 1b: Dictionary

All the chess openings are kept in a CSV document, and generated as a JSON file using a python script.
using JSONReader, each object (chess opening) is add to this class as a Key/Value pair, with the Key being the PGN of the chess opening.
From there, we can create a sub class: "ChessDictionary", that has detailed functions to navigate and return particular openings based on criteria

### 1c: StaticChessParser

Every chess opening has a PGN, which is a single string. The ChessParser object takes this string, and separates every move based on the information that the string provides
The Parser returns information such as:

- The type of piece moved
- The destination of piece
- If the piece performed a capture, check, checkmate or promotion
- If a castling move performed

The Parser then creates additional information, such as:

- The row and column number of the destination (base 0, max 7)
- If the move belonged to black or white
- If castling, Kingside or Queenside

Once all this information has been collected. It is stored in an object, and each pair of moves (tuple) is kept in an array.
This information is then used by `StaticChessLogic()` to determine how the pieces are to move

### 1d: StaticOpeningDatabase

This depreciated out, and is replaced by `Dictionary()`

## Logic and Display

### 2a: FrontPage

Holds and handles `Dictionary()`. Processes and returns search functions of the dictionary
Displays a `Game()` object on the left side
Displays multiple `Game()` objects on the right side
The `FrontPage()` object is the highest level.

### 2b: Game

Each `Game()` holds a `Board()`. It also contains and displays game information obtained from `Dictionary()`. The game elements have click events.

### 2c: Board

This is what is displayed to the user, and contains all the positions and information of `Square()` and `Piece()`. All the `Square()` objects are held in an attribute called "grid".
This is also where `Square()` is init, as well as `Piece()`. It has a function to create each `Piece()` and apply it to the "grid"
This class is pretty in depth with some excellent logic, and really doesnt deserve this short an explanation.

### 2d: Square

64 `Square()` objects are made and held in the `Board()` object. These squares contain attributes that you'd expect from a square in a chessboard.
The most important part of this object is its "contains" attribute. This is where the `Piece()` object is kept.
`Square()` is responsible for updating information about `Piece()`

### 2e: Piece

Pieces are divided into multiple subclasses, for colour (White, Black) and piece type (Pawn, Rook, Knight, Bishop, Queen, King) making 12 subclasses in total.
The `Piece()` class is never updated directly, its "position" attributes are read directly from the `Square()` object
The `Piece()` class also contains a "distance" function, which is different in each of its subclasses. This function is to assist the StaticChessLogic() class in determining if it is that `Piece()` that made the move

### 2f: StaticChessUtility

This is to change board notations (a-g for columns aka **files** and 1-8 for rows aka **ranks**).
This also takes into account that the array is naturally reversed because of the way the board is structured. "1a" on the chessboard is not equal to `[0,0]` which will forever be a pain in my ass.

### 2g: StaticErrorCheck

This class is not fully used as much as I should be using it. It checks basic logical things such as "did you return a `Piece` instead of a null"? and stops the code. Its not used for the data parts. Just for the Logic and Display parts

### 2h: StaticGameLogic

The logic takes `Parser()`, `Board()`, `Square()` and `Piece()` into consideration and does the following:

- Loops through each move information object in the `Parser()` class
- Checks the castling information, and adjusts the `Board()` if applicable
- If no castling, it will use the move information from the `Parser()` and:

  - Determines the type of `Piece()` moved, and which team the `Piece()` belonged to
  - Filters the `Board()` and returns an array of only those certain pieces. Then we look at each `Piece()` in a loop...
  - Using the distance function in `Piece()`, it will determine if each `Piece()`, could have possibly made that move
  - for instance, to calculate if a rook moved to that destination `Square()`, we look at the move information and determine the column of the destination. We then look at the `Piece()` column. We do that with the row as well. If both of these comparisons have a difference over 1, then that was not the Rook that moved, because rooks cannot move diagonally.
  - Once we have found the `Piece()`, we run the command in `Board()` to move the `Piece()`. To do this, we change the contents of Square()

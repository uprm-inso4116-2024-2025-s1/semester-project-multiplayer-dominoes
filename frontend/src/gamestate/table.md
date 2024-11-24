# Table and Domino Classes

## Overview

The `Table` and `Domino` classes are the core components of a domino game implementation. The `Table` class manages the game board, keeping track of domino placements and available moves. The `Domino` class represents individual domino pieces, managing their state, values, and placement.

## Features

### Table Class

The `Table` class represents the game board and provides methods for managing the gameplay in multiplayer dominoes.
It handles domino placement and checking available moves so that the game state can be updated accordingly.

#### Key Methods:
- **`playerChips()`**: Returns an array of 7 random dominoes for the player.
- **`grabRandomChip()`**: Retrieves a random domino from the available dominoes and removes it to make sure that 
there are no duplicates.
- **`calculateOpenEnds()`**: Calculates the sum of the values at the open ends of the domino chain on the table.
- **`placeDomino(domino_to_place, corner)`**: Places a given domino on the table at the left or right corner. Returns `true` if the domino can and is placed, `false` if the move is not allowed.
- **`drawTable()`**: Returns a representation of the table state, making it easier to visualize the game board.

#### Properties:
- **`leftTail`**: Returns the domino at the left end of the table.
- **`rightTail`**: Returns the domino at the right end of the table.
- **`playedDominoes`**: Returns the list of dominoes placed on the table so far.
- **`availableDominos`**: Returns the number of remaining dominoes in the pool.
- **`dominoesMatrix`**: Returns the internal matrix representing domino placements on the table.
- **`dominoesOnTable`**: Returns the number of dominoes currently placed on the table.

### Domino Class

The `Domino` class represents an individual domino tile in the game. Each domino consists of two numbers (values) and a set of coordinates. The class also tracks whether the domino is flipped and manages the free corners that represent where it can be placed.

#### Key Methods:
- **`removeCorner(number)`**: Removes a number from the free corners list, indicating that the number is no longer available for placement on the domino.
  
#### Properties:
- **`coords`**: The coordinates of the domino on the table.
- **`displayDirection`**: The orientation of the domino (`HORIZONTAL` or `VERTICAL`). This is so that dominoes show 
up correctly on the board once played
- **`freeCorners`**: A list of the free corners (values) that can be placed on adjacent dominoes.
- **`values`**: The values on the domino (e.g., `[3, 6]`).
- **`flipped`**: Indicates whether the domino has been flipped.

## Getting Started

### Prerequisites

To use the `Table` and `Domino` classes, you will need a **path matrix** that represents the grid layout of the game. The matrix will define the traversable paths (denoted by `1`) and inaccessible paths (denoted by `0`).

You will also need a **list of dominoes** representing the available pieces in the game. By default, the game uses the standard set of 28 dominoes, but the list can be customized depending on gamemodes, present or future!

### Example Usage

```js
import { Table, Corner, DisplayDirection } from "./table.js"; // Import necessary components
import { Domino } from "./domino.js"; // Import the domino class

// Define the path matrix for the table (playable grid)
const path_matrix = [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
];

// Initialize the table with the path matrix
const table = new Table(path_matrix);

// Create a new domino
const domino = new Domino([3, 6], [2, 2], DisplayDirection.HORIZONTAL);

// Place the domino on the table
table.placeDomino([3, 6], Corner.LEFT);

// Get the current state of the table
console.log(table.drawTable());

# DominoBot and AdvancedBot Classes

## Overview

The `DominoBot` class is a basic implementation of a bot player for the multiplayer dominoes game. It interacts with a domino table and makes moves based on the tiles in its hand. The bot follows a simple strategy: it plays the first valid domino tile it can find that matches one of the free corners on the table.

The `AdvancedBot` class extends `DominoBot` and adds more sophisticated features such as predicting the opponent's hand, evaluating the frequency of certain tiles, and choosing tiles based on a combination of various offensive/
defensive strategies.

## Features

### DominoBot
- **Play a Domino**: The bot can play a domino tile from its hand to the table.
- **Table Interaction**: The bot checks the available corners of the table to find a place to play its tiles.
- **Tile Selection**: The bot chooses the first tile from its hand that can be played.
- **Turn Execution**: It automatically plays its turn by placing a tile on the table, if possible.

### AdvancedBot (extends `DominoBot`)
- **Advanced Strategy**: The `AdvancedBot` incorporates more complex decision-making:
  - **Tile Frequency Count**: Tracks how many times each tile number (0-6) appears in its hand.
  - **Opponent Hand Prediction**: Uses unplayed tiles to estimate the opponent’s remaining tiles.
  - **Strategic Tile Selection**: Chooses tiles based on offensive or defensive strategies, factoring in remaining tiles and opponent hand predictions.
  - **Doubles and High-Value Tiles**: Prioritizes high-value tiles and doubles early in the game.

## Getting Started

### Prerequisites

To use the `DominoBot` or `AdvancedBot`, you will need a **table object** that represents the current state of the game's table. Both bots interact with the table by checking the "free corners" at the two ends of the table.

The **hand of tiles** is an array of what are essentially pairs, where each pair represents a domino 
(e.g., `[a, b]`).

### Example Usage

```js
import { Table, Corner } from "./table.js"; // Import necessary components
import DominoBot from "./DominoBot.js";     // Import the domino bot class
import AdvancedBot from "./AdvancedBot.js"; // Import the advanced bot class that extends the domino bot class

// Example table and hand
const table = new Table(default_path); // Create a new table
const hand = [[1, 5], [6, 3], [4, 6]]; // Example hand of domino tiles

// Initialize the basic bot
const bot = new DominoBot(table, hand);
bot.playTurn(); // Bot plays its turn

// Initialize the advanced bot
const advancedBot = new AdvancedBot(table, hand, []);
advancedBot.playTurn(); // Advanced bot plays its turn


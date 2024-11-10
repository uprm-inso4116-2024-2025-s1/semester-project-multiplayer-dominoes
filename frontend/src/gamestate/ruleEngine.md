# Rule Engine Design Document

## Introduction

The rule engine is the core component of the domino game and is responsible for enforcing the rules, managing turns, validating player moves, calculating scores, and handling end-game conditions. It takes into account the game's logic, AI behavior, ensuring a consistent game accross different game modes.

## Core Components

### 1. Turn-taking System
- The Rule Engine manages the turn-taking system by tracking the current player (either human or AI).
- It ensures that players take turns correctly and enforces the rules for each turn.
- The system handles passing turns if a player cannot make a valid move and drawing tiles if required.

### 2. Move Validation
- The Rule Engine validates each move made by the player or AI. It checks whether a placed domino matches the numbers at the open ends (tails) on the board.
- For each game mode, different validation rules may apply (e.g., in **Draw Dominoes**, players may need to draw tiles until they can play).
- The validation system ensures that only legal moves are allowed, preventing players from breaking the rules.

### 3. Game State Management
- The engine maintains the current state of the game, including the board configuration, played tiles, open ends, player hands, and remaining tiles.
- It dynamically updates the game state as moves are made and tiles are drawn or played.
- The engine also handles resetting the game state for new rounds or matches.

### 4. End-game Conditions
- The engine monitors the game to detect end-game conditions, such as when a player has used all their tiles or when no more valid moves are possible.
- Different game modes may have unique end-game conditions:
    - **Classic Dominoes**: Ends when a player runs out of tiles.
    - **Draw Dominoes**: Ends when a player reaches a score threshold or uses all their tiles.
    - **All Fives**: Ends when the game board is blocked or a player has won with a specific score.

### 5. AI Integration
- The Rule Engine interacts with AI players, applying the same rules for move validation and turn-taking as it does for human players.
- AI players use the Rule Engine to make strategic moves based on the current board state, ensuring fairness.

---

## Game Mode Rules

### Classic Mode
- **Objective**: The player who uses all their tiles first wins.
- **Validation**: A tile can only be placed if one of its numbers matches an open end.
- **Scoring**: No specific scoring system beyond winning the game by playing all tiles.
- **End-game Condition**: The game ends when a player has no tiles left or the game is blocked (i.e., no player can make a move).

### All Fives Mode
- **Objective**: Score points by making the open ends of the board sum to a multiple of five.
- **Validation**: Similar to Classic mode, but with an additional scoring mechanism.
- **Scoring**:
    - If the sum of the numbers on the open ends is divisible by 5, the player scores that sum.
- **End-game Condition**: The game ends when a player runs out of tiles or when no more valid moves are possible.

### Draw Dominoes Mode
- **Objective**: Win by reaching a score of at least 100 points.
- **Validation**: Players must draw tiles if they cannot play. A tile can be played if it matches an open end.
- **Scoring**:
    - At the end of the game, the remaining tiles in a player's hand contribute to the opponent's score.
    - The function `domino_win_score(player_hand)` calculates the total value of tiles left in the player's hand.
- **End-game Condition**: The game ends when a player reaches a score of 100 or uses all their tiles.

---

## API Methods

### `validateMove(domino, table)`
- **Description**: Validates whether a given domino can be played on the current board.
- **Parameters**:
  - `domino`: The domino the player is attempting to place.
  - `table`: The current state of the game board.
- **Returns**: `true` if the move is valid; otherwise, `false`.

### `calculateScore(table)`
- **Description**: Calculates the score based on the current game mode.
- **Usage**:
  - In **All Fives Mode**, it calculates the score based on the open ends' sum.
- **Returns**: The calculated score or `0` if the game mode does not have a scoring system.

### `has_won_game_set(score)`
- **Description**: Checks if a player has won the game by reaching a specified score.
- **Parameters**:
  - `score`: The player's current score.
- **Returns**: `true` if the player’s score is at least 100 (used in Draw Dominoes mode).

### `domino_win_score(player_hand)`
- **Description**: Calculates the total score of a player's remaining dominoes at the end of a game round.
- **Parameters**:
  - `player_hand`: An array representing the player's hand.
- **Returns**: The sum of all the domino values in the player's hand.

---
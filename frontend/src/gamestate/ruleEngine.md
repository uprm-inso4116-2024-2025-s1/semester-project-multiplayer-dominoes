# Rule Engine Design Document

## Introduction

The rule engine is the core component of the domino game and is responsible for enforcing the rules, managing turns, validating player moves, calculating scores, and handling end-game conditions. It takes into account the game's logic, AI behavior, ensuring a consistent game accross different game modes.

## Core components of the Rule Engine

**Turn-taking System**: Ensures that players take turns correctly. The engine tracks the current player and ensures that the correct player is prompted to make a move.

**Move Validation**: For each move, the rule engine ensures the move is valid. This means verifying if the domino placed matches the number at the chosen tail.

**Game State Management**: The rule engine maintains the game state in real-time. It tracks all moves, played dominoes, remaining dominoes, and tails for valid moves.

**End-game Conditions**: The rule engine detects when the game has reached its end. This is decided when a player has used all of their dominoes, or no more valid moves remain.

**AI Integration**: The rule engine interacts with the AI to simulate opponent behavior. It enforces the same rules for the AI as it does for the player.

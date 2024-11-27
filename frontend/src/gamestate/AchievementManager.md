# AchievementManager Class Documentation

## Overview

The `AchievementManager` class is a utility for tracking, managing, and displaying player achievements in a game. It uses visual and toast notifications to highlight accomplishments dynamically during gameplay.

---

## Features

### Achievements Tracked

| Achievement               | Description                                                  |
|---------------------------|--------------------------------------------------------------|
| `startWithDoubleSix`      | Player starts with the [6|6] domino.                         |
| `winGame`                 | Player wins the game.                                        |
| `winWithoutDrawing`       | Player wins without drawing any dominoes.                   |
| `allDoublesHand`          | Player starts with a hand of all doubles.                   |
| `score15`                 | Player reaches or exceeds 15 points.                        |
| `hitExact10`              | Player scores exactly 10 points.                            |
| `winWith5Points`          | Player wins with a score of exactly 5 points.               |
| `hasAnyDoubles`           | Player has at least one double in their initial hand.        |

---

## Dependencies

The `AchievementManager` class relies on the following external libraries:

- **React Toastify** for displaying toast notifications:
  ```javascript
  import { toast } from 'react-toastify';

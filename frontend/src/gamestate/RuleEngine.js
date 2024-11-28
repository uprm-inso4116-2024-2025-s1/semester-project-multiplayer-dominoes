class RuleEngine {
    constructor(gameMode) {
        this.gameMode = gameMode;
        this.rules = this.getRulesForMode(gameMode);
    }

    // Dynamically load rules based on the game mode
    getRulesForMode(mode) {
        switch (mode) {
            case 'classic':
            case 'twoBots':
            case 'threeBots':
                return this.getClassicRules();
            case 'allFives':
                return this.getAllFivesRules();
                // More modes can be added here
            case 'drawDominoes':
                return this.getDrawDominoesRules();
            default:
                throw new Error('Unknown game mode');
        }
    }

    // Define core rules for 'classic' domino
    getClassicRules() {
        return {
            validateMove: (domino, table) => {
                // Ensure leftTail and rightTail are not null before checking freeCorners
                const leftTail = table.leftTail;
                const rightTail = table.rightTail;
                
                // If leftTail or rightTail is null (i.e., no dominoes placed yet), allow placing the first domino
                if (!leftTail && !rightTail) {
                    return true; // No dominoes placed yet, any domino can be placed
                }

                const freeCorners = [leftTail.freeCorners[0], rightTail.freeCorners[0]];
                // Otherwise, check if the domino can be placed at either the left or right tail
                return (freeCorners.includes(domino[0])) || freeCorners.includes(domino[1]);
            },
            // Other core rules can be added here (e.g., scoring)
        };
    }

    // Placeholder for 'allFives' rules
    getAllFivesRules() {
        return {
            validateMove: (domino, table) => {
                const leftTail = table.leftTail;
                const rightTail = table.rightTail;
                if (!leftTail && !rightTail) return true;
                const freeCorners = [leftTail.freeCorners[0], rightTail.freeCorners[0]];
                return (freeCorners.includes(domino[0])) || freeCorners.includes(domino[1]);
            },
            calculateScore(table) {
                const openEndsSum = table.calculateOpenEnds();
                return openEndsSum % 5 === 0 ? openEndsSum : 0;
            }
        };
    }

    // Placeholder for 'drawDominoes' rules
    getDrawDominoesRules() {
        return {
            has_won_game_set: (score) => {
                // If the player has a score of at least 100 points, then they have won the game and
                // as such it can end.
                return score >= 100;
            },
            domino_win_score: (player_hand) => {
                // this calculates the score of the player by the end of the game by getting all the dominoes
                // in the player hand.
                let score = 0;
                for (let i = 0; i < player_hand.length; i++) {
                    score += player_hand[i][0] + player_hand[i][1];
                }
                return score;
            },
            validateMove: (domino, table) => {
                // Ensure leftTail and rightTail are not null before checking freeCorners
                const leftTail = table.leftTail;
                const rightTail = table.rightTail;
                
                // If leftTail or rightTail is null (i.e., no dominoes placed yet), allow placing the first domino
                if (!leftTail && !rightTail) {
                    return true; // No dominoes placed yet, any domino can be placed
                }

                const freeCorners = [leftTail.freeCorners[0], rightTail.freeCorners[0]];
                // Otherwise, check if the domino can be placed at either the left or right tail
                return (freeCorners.includes(domino[0])) || freeCorners.includes(domino[1]);
            },
        };
    }

    // Function to validate moves based on the game mode
    validateMove(domino, table) {
        return this.rules.validateMove(domino, table);
    }

    // Additional methods for scoring, game win/lose conditions can be added here
    calculateScore(table) {
        if (this.gameMode === 'allFives') {
            return this.rules.calculateScore(table);
        }
        return 0;
    }
    domino_win_score(player_hand) {
        // this calculates the score of the player by the end of the game by getting all the dominoes
        // in the player hand.
        let score = 0;
        for (let i = 0; i < player_hand.length; i++) {
            score += player_hand[i][0] + player_hand[i][1];
        }
        return score;
    }
}

export default RuleEngine;
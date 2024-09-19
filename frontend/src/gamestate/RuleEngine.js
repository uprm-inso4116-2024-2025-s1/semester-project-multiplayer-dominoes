class RuleEngine {
    constructor(gameMode) {
        this.gameMode = gameMode;
        this.rules = this.getRulesForMode(gameMode);
    }

    // Dynamically load rules based on the game mode
    getRulesForMode(mode) {
        switch (mode) {
            case 'classic':
                return this.getClassicRules();
            case 'allFives':
                return this.getAllFivesRules();
                // More modes can be added here
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
    
                // Otherwise, check if the domino can be placed at either the left or right tail
                return (leftTail && leftTail.freeCorners.includes(domino[0])) || 
                       (rightTail && rightTail.freeCorners.includes(domino[1]));
            },
            // Other core rules can be added here (e.g., scoring)
        };
    }

    // Placeholder for 'allFives' rules
    getAllFivesRules() {
        return {
            // Specific validation for 'allFives' can go here
        };
    }

    // Function to validate moves based on the game mode
    validateMove(domino, table) {
        return this.rules.validateMove(domino, table);
    }

    // Additional methods for scoring, game win/lose conditions can be added here
}

export default RuleEngine;
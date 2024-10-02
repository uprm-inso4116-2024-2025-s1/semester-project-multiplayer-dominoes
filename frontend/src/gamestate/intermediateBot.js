import DominoBot from "./Bot.js";
import { Corner } from "./table.js";

/**
 *  This class is the middle between the Advanced Bot and the Simple Bot. 
 *  It only cares about playing the highest scoring tiles. 
 */
class IntermediateBot extends DominoBot {
    chooseDomino() {
        let bestScore = -1;
        let bestMove = null;
        
        // Iterates through the hand and looks for the highest scored domino it can play
        for (let domino of this.hand) {
            if(!domino) continue;
            // Check if the domino can be played on the left side
            if (this.table.leftTail.freeCorners.includes(domino[0]) || this.table.leftTail.freeCorners.includes(domino[1])) {
                let score = domino[0] + domino[1];
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { domino, corner: Corner.LEFT };
                }
            }
            // Check if the domino can be played on the right side
            if (this.table.rightTail.freeCorners.includes(domino[0]) || this.table.rightTail.freeCorners.includes(domino[1])) {
                let score = domino[0] + domino[1];
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { domino, corner: Corner.RIGHT };
                }
            }
        }

        return bestMove;
    }
}

export default IntermediateBot;

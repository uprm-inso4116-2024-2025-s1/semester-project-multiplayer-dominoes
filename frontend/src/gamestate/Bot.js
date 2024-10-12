import { Table, Corner, Domino } from "./table.js";

/**
 *  This class is the base class for all bot classes. 
 *  It only cares about playing a tile, the first one it can find.
 */
class DominoBot {

    /**
     * @param {array} table - The table where the bot will be playing. 
     * @param {array} hand - Array of tuples representing the tiles the bot currently has. 
     */
    constructor(table, hand){
        this.table = table;
        this.hand = hand; 
    }

    updateTable(table){
        this.table = table;
    }

    chooseDomino(){
        if (this.hand.length === 0) return null;
        // Iterates through the hand until it finds the first tile it can play
        for(let i = 0; i < this.hand.length; i++){
            let domino = this.hand[i];
            if (!domino) continue;  // Skip undefined or null domino entries
            if (this.table.leftTail.freeCorners.includes(domino[0]) || this.table.leftTail.freeCorners.includes(domino[1])) {
                return { domino, corner: Corner.LEFT };
            }
            if (this.table.rightTail.freeCorners.includes(domino[0]) || this.table.rightTail.freeCorners.includes(domino[1])) {
                return { domino, corner: Corner.RIGHT };
            }
        }
        return null; // If no valid domino to play
    }

    playTurn() {
        const move = this.chooseDomino();
        if (move) {
            this.table.placeDomino(move.domino, move.corner);
            this.hand.splice(this.hand.indexOf(move.domino), 1); // Remove the played domino from hand
            return true;
        } else {
            return false; // Bot can't make a valid move
        }
    }
}

export default DominoBot;
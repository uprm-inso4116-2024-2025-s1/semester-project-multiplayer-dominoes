import { Table, Corner, Domino } from "./table.js";

class DominoBot {

    /**
     * @param {array} table - The table where the bot will be playing. 
     * @param {array} hand - Array of tuples representing the tiles the bot currently has. 
     */
    constructor(table, hand){
        this.table = table;
        this.hand = hand; 
    }

    chooseDomino(){
        for(let i = 0; i < this.hand.length; i++){
            let domino = this.hand[i];
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
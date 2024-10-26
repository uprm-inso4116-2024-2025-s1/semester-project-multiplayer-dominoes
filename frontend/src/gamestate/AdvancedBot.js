import { Corner } from "./table.js";
import DominoBot from "./Bot.js";

class AdvancedBot extends DominoBot {

    /**
     * This constructor calls upon the superclass constructor, and also includes two more parameters:
     * @param {array} table - Same as the superclass constructor.
     * @param {array} hand - Same as the superclass constructor.
     * @param {array} playedTiles - The tiles that have been played on the table. 
     * @param {array} unplayedTiles - The tiles that have yet to be played on the table.
     * 
     */
    constructor(table, hand, playedTiles){
        super(table, hand);
        this.playedTiles = playedTiles || [];
        this.unplayedTiles = [
            [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
            [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[2,2],
            [2,3],[2,4],[2,5],[2,6],[3,3],[3,4],[3,5],
            [3,6],[4,4],[4,5],[4,6],[5,5],[5,6],[6,6]
        ];
    }

    getUnplayedTiles() {
        return this.unplayedTiles;
    }

    getPlayedTiles(){
        return this.playedTiles
    }

    getHand(){
        return this.hand;
    }

    /**
     * Updates the unplayedTiles array depending on the tiles that are on the table and the tiles
     * in the bot's hand. 
     */
    updateUnplayedTiles(){
        this.unplayedTiles = this.unplayedTiles.filter(tile => {
            // Check if the current tile is not in playedTiles
            return !this.playedTiles.some(playedTile => {
                return (playedTile[0] === tile[0] && playedTile[1] === tile[1]) || (playedTile[0] === tile[1] && playedTile[1] === tile[0])});
        });

        this.unplayedTiles = this.unplayedTiles.filter(tile => {
            return !this.hand.some(handTile => {
                return (handTile[0] === tile[0] && handTile[1] === tile[1]) || (handTile[0] === tile[1] && handTile[1] === tile[0])});
            });
    }

    countElements(){
        let counts = [0,0,0,0,0,0,0];
            for(let i = 0; i < this.hand.length; i++){
                let Tile = this.hand[i];
                for(let j = 0; j < 7; j++){
                    if(Tile[0] === j || Tile[1] ===j){
                        counts[j]++;
                    }
                }
            }
        return counts;
    }

    guessOpponentsHand(counts){
        let totalUnplayed = this.unplayedTiles.length;
        let estimatedOpponentScore = 0;

        this.unplayedTiles.forEach(tile => {
            let probability = (counts[tile[0]] + counts[tile[1]]) / totalUnplayed;
            let tileValue = tile[0] + tile[1];
            estimatedOpponentScore += probability * tileValue;
        });

        return estimatedOpponentScore;
    }
    
    isPlayable(domino){
        return (this.table.leftTail.freeCorners.includes(domino[0]) || this.table.leftTail.freeCorners.includes(domino[1])) ||
        (this.table.rightTail.freeCorners.includes(domino[0]) || this.table.rightTail.freeCorners.includes(domino[1])); 
    }

    chooseDomino() {
        let biggest_domino = null;
        let biggest_score = 0;
        this.updateUnplayedTiles();
        let counts = this.countElements();
        for(let i = 0; i < this.hand.length; i++){
            let domino = this.hand[i];

            //Check if playable, if not, skip
            if(!this.isPlayable(domino) || !domino) continue;

            let score = 0;
            // Check if there are more dominoes with the same numbers
            score += counts[domino[0]] + counts[domino[1]];
            //Guess the opponent's hand and likelyness of playing a domino. 
            score -= this.guessOpponentsHand(counts);
            //Play doubles and heavy tiles early.
            score += domino[0] + domino[1];

            if(score > biggest_score){
                biggest_score = score;
                biggest_domino = domino;
            }
        }
        
        if(biggest_domino){
            if (this.table.leftTail.freeCorners.includes(biggest_domino[0]) || this.table.leftTail.freeCorners.includes(biggest_domino[1])) {
                return {domino : biggest_domino, corner : Corner.LEFT};
            }  
            if (this.table.rightTail.freeCorners.includes(biggest_domino[0]) || this.table.rightTail.freeCorners.includes(biggest_domino[1])) {
                return {domino : biggest_domino, corner : Corner.RIGHT};
            }
        }
        return null;
    }
}

export default AdvancedBot; 
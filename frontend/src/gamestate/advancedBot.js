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

    /**
     * Updates the unplayedTiles array depending on the tiles that are on the table and the tiles
     * in the bot's hand. 
     */
    updateUnplayedTiles(){
        console.log(this.playedTiles);
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
        let possibleOpponentTiles = this.unplayedTiles.filter(tile => {
            return !this.playedTiles.some(playedTile => playedTile[0] === tile[0] && playedTile[1] === tile[1]) &&
                   !this.hand.some(handTile => handTile[0] === tile[0] && handTile[1] === tile[1]);
        });
    
        let estimatedOpponentScore = 0;
    
        for (let i = 0; i < possibleOpponentTiles.length; i++) {
            let tile = possibleOpponentTiles[i];
            estimatedOpponentScore += counts[tile[0]] + counts[tile[1]];
        }
    
        return estimatedOpponentScore;
    }
    
    isPlayable(domino){
            if (this.table.leftTail.freeCorners.includes(domino[0]) || this.table.leftTail.freeCorners.includes(domino[1])) {
                return { corner: Corner.LEFT };
            } else if (this.table.rightTail.freeCorners.includes(domino[0]) || this.table.rightTail.freeCorners.includes(domino[1])) {
                return { corner: Corner.RIGHT };
            }
        return null; 
    }

    chooseDomino() {
        let biggest_domino = null;
        let biggest_score = 0;
        let bigCorner = null;
        this.updateUnplayedTiles();
        let counts = this.countElements();
        for(let i = 0; i < this.hand.length; i++){
            let score = 0;
            let domino = this.hand[i];
            // Check if there are more dominoes with the same numbers
            score += counts[domino[0]] + counts[domino[1]];
            //Guess the opponent's hand and likelyness of playing a domino. 
            score += this.guessOpponentsHand(counts);
            //Play doubles and heavy tiles early.
            score += domino[0] + domino[1];
            //Checks if the domino is playable on the table
            bigCorner = this.isPlayable(domino)

            if(score > biggest_score && bigCorner){
                biggest_score = score;
                biggest_domino = domino;
            }

        }
        return  {domino : biggest_domino, corner : bigCorner};
    }
}

export default AdvancedBot; 
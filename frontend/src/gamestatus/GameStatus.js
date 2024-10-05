/**
 *  This class is the class used to get game data when the page is 
 *  refreshed, closed, etc. it might be extended in the future. 
 *  Right now, it contains overall wins, the current table, current
 *  player and the player hands for the player's game.
 */

class GameStatus {
    #current_table;
    #current_player;
    #player_hands;
    #scores;
    constructor(table, current_player, player_hands, player_scores) {
        this.#current_table = table;
        this.#current_player = current_player;
        this.#player_hands = player_hands;
        this.#scores = player_scores;
    }

    // getters
    get CurrentTable() { return this.#current_table; }
    get CurrentPlayer() { return this.#current_player; }
    get PlayerHands() { return this.#player_hands; }
    get Scores() { return this.#scores; }

    // setters
    set CurrentTable(table) { this.#current_table = table; }
    set CurrentPlayer(current_player) { this.#current_player = current_player; }
    set PlayerHands(player_hands) { this.#player_hands = player_hands; }
    set Scores(scores) { this.#scores = scores; }

    // Calculates score when the game ends.
    calculateFinalScores(losingPlayer) {
        const hand = this.#player_hands[losingPlayer];
        const score = hand.reduce((sum, domino) => sum + (domino.left + domino.right), 0);
        this.#scores[losingPlayer] = score; 
        return score;
    }

    // Test Display of score value. Commented for now.
    // displayScoreboard() {
    //     console.log("Current Scores:");
    //     for (const [player, score] of Object.entries(this.#scores)) {
    //         console.log(`${player}: ${score}`);
    //     }
    //     return this.#scores;
    // }
}

export default GameStatus;

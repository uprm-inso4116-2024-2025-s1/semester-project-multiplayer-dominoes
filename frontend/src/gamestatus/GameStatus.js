/**
 *  This class is the class used to get game data when the page is 
 *  refreshed, closed, etc. it might be extended in the future. 
 *  Right now, it contains overall wins, the current table, current
 *  player and the player hands for the player's game.
 * @param {TableData} table
 * @param {PlayerData} current_player
 * @param {string} current_turn
 * @param {int} player_scores
 */

class GameStatus {
    #current_table;
    #current_player;
    #current_turn;
    #scores;
    constructor(table, current_player, current_turn, player_scores) {
        this.#current_table = table;
        this.#current_player = current_player;
        this.#current_turn = current_turn;
        this.#scores = player_scores;
    }

    // getters
    get CurrentTable() { return this.#current_table; }
    get CurrentPlayer() { return this.#current_player; }
    get CurrentTurn() { return this.#current_turn; }
    get Scores() { return this.#scores; }

    // setters
    set CurrentTable(table) { this.#current_table = table; }
    set CurrentPlayer(current_player) { this.#current_player = current_player; }
    set CurrentTurn(current_turn) { this.#current_turn = current_turn; }
    set Scores(scores) { this.#scores = scores; }

    // Calculates score when the game ends.
    calculateFinalScores(losingPlayer) {
        const hand = this.#current_player.PlayerHand[losingPlayer];
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

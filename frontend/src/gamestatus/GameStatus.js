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

    get CurrentTable() { return this.#current_table; }
    get CurrentPlayer() { return this.#current_player; }
    get PlayerHands() { return this.#player_hands; }
    get Scores() { return this.#scores; }

    set CurrentTable(table) { this.#current_table = table; }
    set CurrentPlayer(current_player) { this.#current_player = current_player; }
    set PlayerHands(player_hands) { this.#player_hands = player_hands; }
    set Scores(scores) { this.#scores = scores; }

    calculateFinalScores(losingPlayer) {
        const hand = this.#player_hands[losingPlayer];
        const score = hand.reduce((sum, domino) => sum + (domino.left + domino.right), 0);
        this.#scores[losingPlayer] = score; 
        return score;
    }

    // Test Display of score value
    // displayScoreboard() {
    //     console.log("Current Scores:");
    //     for (const [player, score] of Object.entries(this.#scores)) {
    //         console.log(`${player}: ${score}`);
    //     }
    //     return this.#scores;
    // }
}

export default GameStatus;

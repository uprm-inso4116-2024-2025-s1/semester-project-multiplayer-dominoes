class GameStatus {
    #current_table;
    #current_player;
    #player_hands;
    #scores;
    #selected_domino;
    constructor(table, current_player, player_hands, player_scores) {
        this.#current_table = table;
        this.#current_player = current_player;
        this.#player_hands = player_hands;
        this.#scores = player_scores;
        this.#selected_domino = null;
    }

    get CurrentTable() { return this.#current_table; }
    get CurrentPlayer() { return this.#current_player; }
    get PlayerHands() { return this.#player_hands; }
    get Scores() { return this.#scores; }
    get SelectedDomino() { return this.#selected_domino; }

    set CurrentTable(table) { this.#current_table = table; }
    set CurrentPlayer(current_player) { this.#current_player = current_player; }
    set PlayerHands(player_hands) { this.#player_hands = player_hands; }
    set Scores(scores) { this.#scores = scores; }
    set SelectedDomino(domino) { this.#selected_domino = domino; }

    calculateFinalScores(losingPlayer) {
        const hand = this.#player_hands[losingPlayer];
        const score = hand.reduce((sum, domino) => sum + (domino.left + domino.right), 0);
        this.#scores[losingPlayer] = score; 
        return score;
    }

    placeDomino(position) {
        if (!this.#selected_domino) return false;

        const isValidMove = this.validateMove(this.#selected_domino, position);
        if (isValidMove) {
            this.#current_table.addDomino(this.#selected_domino, position);
            this.#player_hands[this.#current_player] = this.#player_hands[this.#current_player].filter(d => d !== this.#selected_domino);
            this.#selected_domino = null;
            return true;
        } else {
            console.log("Invalid move!");
            return false;
        }
    }

    validateMove(domino, position) {
        return true; 
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
class GameStatus{
    #current_table;
    #current_player;
    #player_hands;
    constructor(table, current_player, player_hands){
        this.#current_table = table;
        this.#current_player = current_player;
        this.#player_hands = player_hands;
    }

    get CurrentTable(){return this.#current_table}
    get CurrentPlayer(){return this.#current_player}
    get PlayerHands(){return this.#player_hands}
    
    set CurrentTable(table){this.#current_table = table}
    set CurrentPlayer(current_player){this.#current_player = current_player}
    set PlayerHands(player_hands){this.#player_hands = player_hands}
}

export default GameStatus

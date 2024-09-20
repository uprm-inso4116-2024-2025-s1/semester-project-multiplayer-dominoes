import GameStatus from "./GameStatus.js"
import {Table} from "../../../frontend/src/gamestate/table.js"

describe('Game status logic', () => {
    let test_table = new Table("a", "a")
    let test_player_hands = ["aaaa"]
    let test_curr_player = "test_string_curr_player"
    let game_status = new GameStatus(test_table, test_curr_player, test_player_hands);

    test('Testing that variables are set correctly', () => {
        expect(game_status.CurrentTable.dominoesMatrix).toBe(test_table.dominoesMatrix);
        expect(game_status.CurrentPlayer).toBe(test_curr_player);
        expect(game_status.PlayerHands).toBe(test_player_hands);
    });
});


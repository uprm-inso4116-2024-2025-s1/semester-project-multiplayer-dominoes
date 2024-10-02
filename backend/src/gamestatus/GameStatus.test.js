import GameStatus from "./GameStatus.js"
import {Table} from "../../../frontend/src/gamestate/table.js"

describe('Game status logic', () => {
    let test_table = new Table("a", "a")
    let test_player_hands = ["aaaa"]
    let test_curr_player = "test_string_curr_player"
    let game_status = new GameStatus(test_table, test_curr_player, test_player_hands);
    let test_scores = {player1: 0, player2: 0};

    test('Testing that variables are set correctly', () => {
        expect(game_status.CurrentTable.dominoesMatrix).toBe(test_table.dominoesMatrix);
        expect(game_status.CurrentPlayer).toBe(test_curr_player);
        expect(game_status.PlayerHands).toBe(test_player_hands);
        expect(game_status.Scores).toBe(test_scores);
    });

    test('Calculating final scores', () => {
        const losingPlayer = "player1";
        const score = game_status.calculateFinalScores(losingPlayer);
        expect(score).toBe(10);  // 1+2 + 3+4 = 10
        expect(game_status.Scores[losingPlayer]).toBe(10);
    });
});


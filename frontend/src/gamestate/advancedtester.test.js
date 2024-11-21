import { Corner } from "./table.js";
import AdvancedBot from "./AdvancedBot.js";

describe("AdvancedBot", () => {

    let table;
    let hand;
    let playedTiles;
    let bot;

    beforeEach(() => {
        table = {
            leftTail: { freeCorners: [3] },
            rightTail: { freeCorners: [6] }
        };
        hand = [
            [6,6], [5, 6], [1, 1], [0, 3]
        ];
        playedTiles = [
            [3, 4], [4,6]
        ];
        bot = new AdvancedBot(table, hand, playedTiles);
    });

    test("Should count correctly the numbers of tiles bot has", () => {
        const counts = bot.countElements();
        // Count should be [1,1,0,1,0,1,2]
        // For tile [1,1], it should count it as one number only, since it can only play that tile once.
        expect(counts[0]).toBe(1);
        expect(counts[1]).toBe(1);
        expect(counts[2]).toBe(0);
        expect(counts[3]).toBe(1);
        expect(counts[4]).toBe(0);
        expect(counts[5]).toBe(1);
        expect(counts[6]).toBe(2);
    });

    test("Should update unplayedTiles accordingly", () => {
        bot.updateUnplayedTiles();
        const unplayedTiles = bot.getUnplayedTiles();
        console.log(unplayedTiles);
        // 22 unplayed tiles, the bot removes the played tiles and the tiles in its hand. 
        expect(unplayedTiles.length).toBe(22);
        expect(unplayedTiles.some(tile => tile[0] === 3 && tile[1] === 4)).toBe(false);
        expect(unplayedTiles.some(tile => tile[0] === 4 && tile[1] === 6)).toBe(false);
        expect(unplayedTiles.some(tile => tile[0] === 4 && tile[1] === 4)).toBe(true);
    });

    test("Should correctly guess the opponents hand", () => {
        const counts = bot.countElements();
        const opponentScore = bot.guessOpponentsHand(counts);
        expect(opponentScore).toBeGreaterThan(0);
    });

    test("Should choose the best domino", () => {
        const chosenDomino = bot.chooseDomino();
        console.log(chosenDomino);
        expect(chosenDomino).toEqual({domino: [6,6], corner: 1});
    });

});

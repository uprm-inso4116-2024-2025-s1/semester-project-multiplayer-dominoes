import { Corner, Table } from './gamestate/table.js';
import DominoBot from './gamestate/Bot.js';
import IntermediateBot from './gamestate/intermediateBot.js';
import RuleEngine from './gamestate/RuleEngine.js';

function getDefaultTable() {
  return [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
}

describe('Table logic', () => {
  const table = new Table(getDefaultTable());

  test('Does not place incorrect domino', () => {
    expect(table.placeDomino([6, 6], Corner.LEFT)).toBe(true);
    expect(table.placeDomino([1, 5], Corner.RIGHT)).toBe(false);
  });

  test('Places correct sequence of dominos', () => {
    expect(table.placeDomino([6, 6], Corner.LEFT)).toBe(true);
    expect(table.placeDomino([1, 6], Corner.LEFT)).toBe(true);
    expect(table.placeDomino([6, 3], Corner.RIGHT)).toBe(true);
  });

  test('No duplicate dominoes are created', () => {
    const dominoSet = new Set();
    // There are 28 different dominoes.
    for (let i = 0; i < 28; i++) {
      const randomChip = table.grabRandomChip();
      expect(dominoSet).not.toContain(randomChip);
      dominoSet.add(randomChip);
    }
  });
});

describe('Bot logic', () => {
  let table = new Table(getDefaultTable());
  table.placeDomino([4, 2], Corner.LEFT);
  table.placeDomino([1, 4], Corner.LEFT);

  test('Chooses correct domino', () => {
    let dominoBot = new DominoBot(table, [[6, 5], [2, 3]]);
    const move = dominoBot.chooseDomino();
    expect(move.domino).toEqual([2, 3]);
    expect(move.corner).toEqual(Corner.RIGHT);
  });

  test('Returns null due to no valid domino', () => {
    let dominoBot = new DominoBot(table, [[0, 0], [4, 3]]);
    expect(dominoBot.playTurn()).toEqual(false);
  });

});

describe('Intermediate Bot logic', () => {
  let table = new Table(getDefaultTable());
  table.placeDomino([6, 6], Corner.LEFT);
  table.placeDomino([6, 3], Corner.RIGHT);

  test('No playable domino', () => {
    let dominoBot = new IntermediateBot(table, [[5, 2], [4, 1], [2, 4], [5, 5]]);
    const move = dominoBot.chooseDomino();
    expect(move).toEqual(null);
  });

  test('Chooses highest domino in hand', () => {
    let dominoBot = new IntermediateBot(table, [[5, 3], [4, 1], [3, 4], [6, 4]]);
    const move = dominoBot.chooseDomino();
    dominoBot.playTurn();
    expect(move.domino).toEqual([6, 4]);
    expect(move.corner).toEqual(Corner.LEFT);

    const secondMove = dominoBot.chooseDomino();
    expect(secondMove.domino).toEqual([5, 3]);
    expect(secondMove.corner).toEqual(Corner.RIGHT);
  });
});

describe('Rule engine logic', () => {

  describe('Rule engine - classic', () => {
    let table = new Table(getDefaultTable());
    table.placeDomino([6, 6], Corner.LEFT);
    table.placeDomino([6, 3], Corner.RIGHT);
    let ruleEngine = new RuleEngine('classic');

    test('Valid domino', () => {
      expect(ruleEngine.validateMove([3, 4], table)).toBe(true);
      expect(ruleEngine.validateMove([6, 2], table)).toBe(true);
    });

    test('Empty table - Valid move', () => {
      let empty_table = new Table(getDefaultTable());
      expect(ruleEngine.validateMove([6, 6], empty_table)).toBe(true);
      expect(ruleEngine.validateMove([4, 3], empty_table)).toBe(true);
    });

    test('Invalid move', () => {
      expect(ruleEngine.validateMove([6, 6], table)).toBe(true);
      expect(ruleEngine.validateMove([4, 2], table)).toBe(false);
    })
  });

  describe('Rule engine - allFives', () => {
    test('should calculate correct score when open ends are multiple of 5', () => {
        const table = new Table(getDefaultTable());
        const ruleEngine = new RuleEngine('allFives');

        table.placeDomino([6, 6], Corner.LEFT);
        table.placeDomino([6, 4], Corner.RIGHT);

        const openEndsSum = table.calculateOpenEnds();
        expect(openEndsSum).toBe(10);  // The sum of the ends should be 10 (6 + 4).
        
        const score = ruleEngine.calculateScore(table);
        expect(score).toBe(10);  // Score should be 10 as it’s divisible by 5.
    });

    test('should return zero score if open ends are not multiple of 5', () => {
        const table = new Table(getDefaultTable());
        const ruleEngine = new RuleEngine('allFives');

        table.placeDomino([6, 6], Corner.LEFT);
        table.placeDomino([6, 3], Corner.RIGHT);

        const openEndsSum = table.calculateOpenEnds();
        expect(openEndsSum).toBe(9);  // Sum of the ends is 9 (6 + 3).

        const score = ruleEngine.calculateScore(table);
        expect(score).toBe(0);  // No score as 9 isn't divisible by 5.
    });

    test('should calculate score for a single domino placement', () => {
        const table = new Table(getDefaultTable());
        const ruleEngine = new RuleEngine('allFives');

        table.placeDomino([5, 5], Corner.LEFT);  // Place a double domino (5|5)

        const openEndsSum = table.calculateOpenEnds();
        expect(openEndsSum).toBe(10);  // Single [5, 5] means open ends sum is 10.

        const score = ruleEngine.calculateScore(table);
        expect(score).toBe(10);  // Score should be 10 as it's divisible by 5.
    });

    test('should calculate correct score after placing multiple dominos', () => {
        const table = new Table(getDefaultTable());
        const ruleEngine = new RuleEngine('allFives');

        table.placeDomino([6, 6], Corner.LEFT);
        table.placeDomino([6, 4], Corner.RIGHT);
        table.placeDomino([4, 2], Corner.RIGHT);  // Adding another domino (4|2)

        const openEndsSum = table.calculateOpenEnds();
        expect(openEndsSum).toBe(8);  // After placing [4, 2], open ends should be 6 + 2 = 8.

        const score = ruleEngine.calculateScore(table);
        expect(score).toBe(0);  // No score as 8 isn't divisible by 5.
    });

    test('should handle no score when open ends are zero', () => {
        const table = new Table(getDefaultTable());
        const ruleEngine = new RuleEngine('allFives');

        table.placeDomino([0, 0], Corner.LEFT);  // Placing a [0, 0] domino

        const openEndsSum = table.calculateOpenEnds();
        expect(openEndsSum).toBe(0);  // Open ends should sum to 0.

        const score = ruleEngine.calculateScore(table);
        expect(score).toBe(0);  // Score should be 0 since the open ends sum is 0.
    });
});
});
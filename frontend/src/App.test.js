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
  let table = new Table(getDefaultTable());
  table.placeDomino([6, 6], Corner.LEFT);
  table.placeDomino([6, 3], Corner.RIGHT);

  describe('Rule engine - classic', () => {
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
    // Unit tests will be added when allFives gets implemented.
  });
});

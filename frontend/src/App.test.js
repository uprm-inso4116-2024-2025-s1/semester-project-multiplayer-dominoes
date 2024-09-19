import { Corner, Table } from './gamestate/table.js';
import DominoBot from './gamestate/Bot.js';

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
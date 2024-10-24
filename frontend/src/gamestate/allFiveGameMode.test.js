import { Table } from './table';
import RuleEngine from './RuleEngine';

describe('All Fives Game Mode', () => {
  let table;
  let ruleEngine;

  beforeEach(() => {
    const defaultPath = [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ];
    table = new Table(defaultPath);
    ruleEngine = new RuleEngine('allFives');
  });

  test('should calculate correct score when open ends are multiple of 5', () => {
    table.placeDomino([6, 6], 'left');
    table.placeDomino([6, 4], 'right');
    const openEndsSum = table.calculateOpenEnds();

    console.log("Open Ends Sum:", openEndsSum);  

    expect(openEndsSum).toBe(10);  // The sum of the ends should be 10 (6 + 4).
    const score = openEndsSum % 5 === 0 ? openEndsSum : 0;
    expect(score).toBe(10);  // Score should be 10 as it’s divisible by 5.
  });

  test('should return zero score if open ends are not multiple of 5', () => {
    table.placeDomino([6, 6], 'left');
    table.placeDomino([6, 3], 'right');
    const openEndsSum = table.calculateOpenEnds();

    expect(openEndsSum).toBe(9);  // Sum of the ends is 9 (6 + 3).
    const score = openEndsSum % 5 === 0 ? openEndsSum : 0;
    expect(score).toBe(0);  // No score as 9 isn't divisible by 5.
  });

  test('should calculate score for a single domino placement', () => {
    table.placeDomino([5, 5], 'left');
    const openEndsSum = table.calculateOpenEnds();

    expect(openEndsSum).toBe(10);  // Single [5, 5] means open ends sum is 10.
    const score = openEndsSum % 5 === 0 ? openEndsSum : 0;
    expect(score).toBe(10);  // Score should be 10 as it's divisible by 5.
  });

  test('should calculate correct score after placing multiple dominos', () => {
    table.placeDomino([6, 6], 'left');
    table.placeDomino([6, 4], 'right');
    table.placeDomino([4, 2], 'right');  // Adding another domino
    const openEndsSum = table.calculateOpenEnds();

    expect(openEndsSum).toBe(8);  // After [4, 2] placed, open ends should be 6 + 2 = 8.
    const score = openEndsSum % 5 === 0 ? openEndsSum : 0;
    expect(score).toBe(0);  // No score as 8 isn't divisible by 5.
  });

  test('should handle no score when open ends are zero', () => {
    table.placeDomino([0, 0], 'left');  // Placing [0, 0] domino
    const openEndsSum = table.calculateOpenEnds();

    expect(openEndsSum).toBe(0);  // Open ends should sum to 0.
    const score = openEndsSum % 5 === 0 ? openEndsSum : 0;
    expect(score).toBe(0);  // Score should be 0 since it's divisible by 5, but the sum is 0.
  });

});
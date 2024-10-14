import AdvancedBot from './advancedBot.js';
import { Corner } from './table.js';

// Scenario 1: Simple starting hand
const scenario1 = {
    table: {
        leftTail: { freeCorners: [6] },  // Define free corners for left tail
        rightTail: { freeCorners: [3] }  // Define free corners for right tail
    },
    botHand: [[5, 6], [2, 3], [1, 4], [4, 6]],  // Bot's hand
    playedTiles: [[6, 6], [6, 3]],  // Tiles already played
    opponentHand: [[0, 1], [2, 4], [3, 5]]  // Simulated opponent hand for testing
};

// Scenario 2: More complex hand with higher number tiles
const scenario2 = {
    table: {
        leftTail: { freeCorners: [4] },  
        rightTail: { freeCorners: [2] }
    },
    botHand: [[5, 6], [1, 4], [3, 6], [2, 5]],
    playedTiles: [[4, 4], [4, 2]],
    opponentHand: [[0, 1], [2, 3], [1, 2]]
};

// Scenario 3: Bot has fewer tiles, opponent likely has matching numbers
const scenario3 = {
    table: {
        leftTail: { freeCorners: [3] },
        rightTail: { freeCorners: [6] }
    },
    botHand: [[1, 3], [5,6], [0, 3]],
    playedTiles: [[3, 3], [3, 6]],
    opponentHand: [[2, 3], [1, 5], [2, 6]]
};

// Define this for other test scenarios as well


const scenario4 = {
    table: [[5,6], [3, 6]],
    botHand: [[6,6],[1,3],[4,4]],
    playedTiles: [[5,6], [3, 6]],
    opponentHand: [[2, 3], [1, 5], [2,6]]
}

// Function to simulate a round and get bot's decision
function simulateRound(bot, scenario) {
    bot.updateUnplayedTiles();
    const chosenDomino = bot.chooseDomino();
    return chosenDomino;
}

// Jest tests for different scenarios

test('Bot correctly updates the played tiles from the board', () => {
    const bot = new AdvancedBot(scenario4.table, scenario4.botHand, scenario4.playedTiles);
    bot.updateUnplayedTiles();
    const unplayedTiles = [
        [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
        [1,1],[1,2],[1,4],[1,5],[1,6],[2,2],
        [2,3],[2,4],[2,5],[2,6],[3,3],[3,4],[3,5]
        ,[4,5],[4,6],[5,5],
    ];
    expect(bot.unplayedTiles).toEqual(unplayedTiles);
});

test('Countelements should correctly count the elements', () => {
    const bot = new AdvancedBot(scenario4.table, scenario4.botHand, scenario4.playedTiles)
    const count = bot.countElements();
    //botHand: [[6,6],[1,3],[4,4]],
    const expectedCount = [0,1,0,1,1,0,1];
    expect(count).toEqual(expectedCount);
});

test('Scenario 1: Bot should make a valid strategic move based on the hand', () => {
    const bot = new AdvancedBot(scenario1.table, scenario1.botHand, scenario1.playedTiles);
    const counts = bot.countElements();
    const guessedScore = bot.guessOpponentsHand(counts);
    
    // Ensure the bot guesses opponent's hand and returns a positive score
    expect(guessedScore).toBeGreaterThan(0);
    
    // Ensure the bot chooses a valid domino
    const chosenDomino = bot.chooseDomino();
    const expectedDomino = { domino : [ 5, 6 ], corner : Corner.LEFT}
    expect(chosenDomino.domino).toEqual(expectedDomino.domino); 
    expect(chosenDomino.corner).toEqual({"corner": -1}); //Corner.LEFT 
});

test('Scenario 2: Bot should play the best move based on more complex hand', () => {
    const bot = new AdvancedBot(scenario2.table, scenario2.botHand, scenario2.playedTiles);
    const counts = bot.countElements();
    const guessedScore = bot.guessOpponentsHand(counts);
    
    expect(guessedScore).toBeGreaterThan(0);  // Positive score for the opponent's guessed hand

    const chosenDomino = simulateRound(bot, scenario2);
    const expectedDomino = { domino : [2,5], corner : 1}
    expect(chosenDomino.domino).toEqual(expectedDomino.domino);  // Bot should choose a valid domino
    expect(chosenDomino.corner).toEqual({"corner":1}) //Corner.RIGHT
});

test('Scenario 3: Bot should block opponent if necessary', () => {
    const bot = new AdvancedBot(scenario3.table, scenario3.botHand, scenario3.playedTiles);
    const counts = bot.countElements();
    const guessedScore = bot.guessOpponentsHand(counts);
    
    expect(guessedScore).toBeGreaterThan(0);  // Bot guesses opponent's hand

    const chosenDomino = simulateRound(bot, scenario3);
    const expectedDomino = { domino : [5,6], corner: {"corner":1}}
    expect(chosenDomino.domino).toEqual(expectedDomino.domino);  // Bot plays a tile
    expect(chosenDomino.corner).toEqual({"corner": 1}); //Corner.RIGHT
    // Further checks could be added here to validate that the bot chooses the best move
});

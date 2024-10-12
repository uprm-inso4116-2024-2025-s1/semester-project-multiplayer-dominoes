import AdvancedBot from './advancedBot.js';

// Scenario 1: Simple starting hand
const scenario1 = {
    table: [[6, 6], [6, 3]],  // Played tiles on the table
    botHand: [[5, 6], [2, 3], [1, 4], [4, 6]],  // Bot's hand
    playedTiles: [[6, 6], [6, 3]],  // Tiles already played
    opponentHand: [[0, 1], [2, 4], [3, 5]]  // Simulated opponent hand for testing
};

// Scenario 2: More complex hand with higher number tiles
const scenario2 = {
    table: [[4, 4], [4, 2]],  // Played tiles on the table
    botHand: [[5, 6], [2, 4], [3, 6], [1, 5]],  // Bot's hand
    playedTiles: [[4, 4], [4, 2]],  // Tiles already played
    opponentHand: [[0, 1], [2, 3], [1, 2]]  // Simulated opponent hand for testing
};

// Scenario 3: Bot has fewer tiles, opponent likely has matching numbers
const scenario3 = {
    table: [[3, 3], [3, 6]],  // Played tiles on the table
    botHand: [[1, 3], [6, 5], [0, 3]],  // Bot's hand
    playedTiles: [[3, 3], [3, 6]],  // Tiles already played
    opponentHand: [[2, 3], [1, 5], [2, 6]]  // Simulated opponent hand for testing
};

// Function to simulate a round and get bot's decision
function simulateRound(bot, scenario) {
    bot.updateUnplayedTiles();
    const chosenDomino = bot.chooseDomino();
    console.log("Bot played: ", chosenDomino);
    return chosenDomino;
}

// Jest tests for different scenarios

test('Bot correctly updates the played tiles from the board', () => {
    const bot = new AdvancedBot(scenario1.table, scenario1.botHand, scenario1.playedTiles);
    bot.updateUnplayedTiles();
    const unplayedTiles = [
        [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
        [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[2,2],
        [2,3],[2,4],[2,5],[2,6],[3,3],[3,4],[3,5],
        [4,4],[4,5],[4,6],[5,5],[5,6]
    ];
    expect(bot.unplayedTiles).toEqual(unplayedTiles);
});

test('Countelements should correctly count the elements', () => {
    const bot = new AdvancedBot(scenario1.table, scenario1.botHand, scenario1.playedTiles)
    const count = bot.countElements();
    //botHand: [[5, 6], [2, 3], [1, 4], [4, 6]]
    const expectedCount = [0,1,1,1,2,1,2];
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
    expect(chosenDomino).toBeDefined(); 
});

test('Scenario 2: Bot should play the best move based on more complex hand', () => {
    const bot = new AdvancedBot(scenario2.table, scenario2.botHand, scenario2.playedTiles);
    const counts = bot.countElements();
    const guessedScore = bot.guessOpponentsHand(counts);
    
    expect(guessedScore).toBeGreaterThan(0);  // Positive score for the opponent's guessed hand

    const chosenDomino = simulateRound(bot, scenario2);
    expect(chosenDomino).toBeDefined();  // Bot should choose a valid domino
});

test('Scenario 3: Bot should block opponent if necessary', () => {
    const bot = new AdvancedBot(scenario3.table, scenario3.botHand, scenario3.playedTiles);
    const counts = bot.countElements();
    const guessedScore = bot.guessOpponentsHand(counts);
    
    expect(guessedScore).toBeGreaterThan(0);  // Bot guesses opponent's hand

    const chosenDomino = simulateRound(bot, scenario3);
    expect(chosenDomino).toBeDefined();  // Bot plays a tile
    // Further checks could be added here to validate that the bot chooses the best move
});

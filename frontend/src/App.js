import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

import MainGame from './gamestate/experimentalGame.js';

function App() {

  const [showRules, setShowRules] = useState(false);

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <div className="App">
      <header className="App-header">
      <button onClick={toggleRules} className="rules-button">
          {showRules ? 'Close' : 'How to Play'}
        </button>
        <MainGame/>
        {showRules && (
          <div className="rules-overlay">
            <div className="rules">
              <h2>How to Play Dominoes</h2>
              <p>
                <strong>Players:</strong> Two, three, or four may play. If four are playing, it may be played as a partnership (the two players sitting opposite one another are partners).
              </p>
              <p>
                <strong>The Shuffle:</strong> The dominoes are shuffled. Players draw one domino. The player drawing the highest double, or if no double, the highest domino plays first. Re-shuffle and begin drawing the first hand.
              </p>
              <p>
                <strong>Drawing:</strong> Each player draws seven dominoes for their hand. The remaining dominoes (the boneyard) are left face down to be drawn later if a player is unable to play.
              </p>
              <p>
                <strong>Begin Play:</strong> The player who drew the highest domino plays first. The objective is to score points by laying dominoes end to end. If the dots on the exposed ends total a multiple of five, the player is awarded points.
              </p>
              <p>
                <strong>Blocking the Game:</strong> If no player can play, the game is blocked. The player with the least spots in their hand scores the total spots of the opponents' hands.
              </p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

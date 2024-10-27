import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React, { useState } from 'react';

import Lobby from './lobby/lobby.js';
import Login from './Auth/Login.js';
import MainGame from './gamestate/experimentalGame.js';
import Home from './Home/Home.js';
import GameMode from './gameMode.js';
import ForgotPassword from './Auth/ForgotPassword.js';
import ResetPassword from './Auth/ResetPassword.js';
import ChatPopup from './gamestate/Chat.js';

function App() {
  const [showRules, setShowRules] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  const playSound = () => {
    const audio = document.getElementById('howToPlaySound');
    if (audio) {
      audio.play();
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/game" 
            element={
              <>
                <button onClick={() => { toggleRules(); playSound(); }} className="rules-button">
                  {showRules ? 'Close' : 'How to Play'}
                </button>
                <button onClick={toggleChat} className="chat-button">Chat</button>
                <MainGame />
                {showRules && (
                  <div className="rules-overlay">
                    <div className="rules">
                      <h2>How to Play Dominoes</h2>
                      <p><strong>Players:</strong> Two, three, or four may play. If four are playing, it may be played as a partnership (the two players sitting opposite one another are partners).</p>
                      <p><strong>The Shuffle:</strong> The dominoes are shuffled. Players draw one domino. The player drawing the highest double, or if no double, the highest domino plays first. Re-shuffle and begin drawing the first hand.</p>
                      <p><strong>Drawing:</strong> Each player draws seven dominoes for their hand. The remaining dominoes (the boneyard) are left face down to be drawn later if a player is unable to play.</p>
                      <p><strong>Begin Play:</strong> The player who drew the highest domino plays first. The objective is to score points by laying dominoes end to end. If the dots on the exposed ends total a multiple of five, the player is awarded points.</p>
                      <p><strong>Blocking the Game:</strong> If no player can play, the game is blocked. The player with the least spots in their hand scores the total spots of the opponents' hands.</p>
                    </div>
                  </div>
                )}
                {showChat && <ChatPopup onClose={toggleChat} />} 
              </>
            } 
          />
            
            <Route path="/game/:roomId" element={<MainGame />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/gameMode" element={<GameMode />} />
          </Routes>
          <audio id="howToPlaySound" src="/DominoesClick.wav" preload="auto"></audio>
        </header>
      </div>
    </Router>
  );
}

export default App;
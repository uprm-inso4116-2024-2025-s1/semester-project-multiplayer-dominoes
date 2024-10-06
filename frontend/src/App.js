import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import React, { useState } from 'react';

import Lobby from './lobby/lobby.js';
import Login from './Auth/Login.js';
import MainGame from './gamestate/experimentalGame.js';
import Home from './Home/Home.js'; // Import the Home component

function App() {
  const [showRules, setShowRules] = useState(false);

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/game" element={<MainGame />} />
            <Route path="/lobby" element={<Lobby />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
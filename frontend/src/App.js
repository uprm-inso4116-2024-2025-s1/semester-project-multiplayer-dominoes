import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Lobby from './lobby/lobby.js'
import Login from './Auth/Login.js';

import MainGame from './gamestate/experimentalGame.js';
import PauseScreen from './gamestate/Pause.js';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/game" element={<MainGame />} />
            <Route path="/lobby" element={<Lobby/>} />
            <Route path="/pauseScreen" element={<PauseScreen />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

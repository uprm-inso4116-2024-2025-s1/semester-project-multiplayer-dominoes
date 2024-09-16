import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './Auth/Login.js';

import MainGame from './gamestate/experimentalGame.js';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/game" element={<MainGame />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

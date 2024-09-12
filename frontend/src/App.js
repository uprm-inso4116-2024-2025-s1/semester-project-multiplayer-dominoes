import logo from './logo.svg';
import './App.css';
import Lobby from './lobby/lobby.js';
import MainGame from './gamestate/experimentalGame.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Lobby/>
      </header>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';

import MainGame from './gamestate/experimentalGame.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MainGame/>
      </header>
    </div>
  );
}

export default App;

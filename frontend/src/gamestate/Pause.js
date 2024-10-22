import { useNavigate } from "react-router-dom";

export default function PauseScreen({ onResume }) {
    const navigate = useNavigate();
    
    return (
        <div className="overlay">
            <img src={'gamePaused.png'} alt="Game Paused" className="pause-image" />
            <div className="button-container">
                <button onClick={onResume}>Resume Game</button>
                <button onClick={() => navigate('/')}>Back To Login</button>
            </div>
        </div>
    );
}
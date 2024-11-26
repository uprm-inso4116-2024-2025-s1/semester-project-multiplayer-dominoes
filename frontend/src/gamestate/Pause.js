import { useNavigate } from "react-router-dom";

export default function PauseScreen({ onResume }) {
    const navigate = useNavigate();
    const playButtonSound = () => {
        const audio = document.getElementById("buttonSound");
        if (audio) {
            audio.play();
        }
    };
    
    return (
        <div className="overlay">
            <img src={'gamePaused.png'} alt="Game Paused" className="pause-image" />
            <div className="button-container">
                <button onClick={() => { playButtonSound(); onResume(); }}>Resume Game</button>
                <button onClick={() => { playButtonSound(); navigate('/'); }}>Back To Login</button>
            </div>
            <audio id="buttonSound" src="/GamestateSound.wav" preload="auto"></audio>
        </div>
    );
}
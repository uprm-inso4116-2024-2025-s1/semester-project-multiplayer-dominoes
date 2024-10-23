import { useNavigate } from "react-router-dom";

export default function GameMode() {
    const navigate = useNavigate();
    return (
        <div><p>Choose game mode:</p>
            <button onClick={() => navigate('/game', { state: { gameMode: 'classic' } })}>vs. AI</button>
            <button onClick={() => navigate('/game', { state: { gameMode: 'twoBots' } })}>vs. 2 AI</button>
            <button onClick={() => navigate('/game', { state: { gameMode: 'threeBots' } })}>vs. 3 AI</button>
            <button onClick={() => {
                navigate('/game', { state: { gameMode: 'allFives' } })
            }}>All Fives</button>
        </div >
    )
}
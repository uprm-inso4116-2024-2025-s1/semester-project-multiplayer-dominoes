import { useNavigate } from "react-router-dom";

export default function GameMode() {
    const navigate = useNavigate();
    return (
        <div><p>Choose game mode:</p>
            <button onClick={() => navigate('/game', { state: { gameMode: 'classic', bot: 'placeholder' } })}>vs. AI</button>
            <button onClick={() => {
                navigate('/game', { state: { gameMode: 'allFives', bot: 'placeholder' } })
            }}>All Fives</button>
        </div >
    )
}
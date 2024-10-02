import { useNavigate } from "react-router-dom";

export default function GameMode() {
    const navigate = useNavigate();
    return (
        <div><p>Choose game mode:</p>
            <button onClick={() => { navigate('/game') }}>vs. AI</button>
            <button onClick={() => {
                navigate('/lobby');
            }}>vs. player</button>
        </div >
    )
}
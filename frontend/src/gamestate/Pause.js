import { useNavigate } from "react-router-dom";

export default function PauseScreen({ onResume }) {
    const navigate = useNavigate();
    return (
        <div><p>Game Paused</p>
            <button onClick={onResume}>Resume Game</button>
            <button onClick={() => {
                navigate('/');
            }}>Back to login</button>
        </div >
    )
}
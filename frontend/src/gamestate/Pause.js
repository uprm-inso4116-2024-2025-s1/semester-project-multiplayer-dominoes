import { useNavigate } from "react-router-dom";

export default function PauseScreen() {
    const navigate = useNavigate();
    return (
        <div><p>Game Paused</p>
            <button onClick={() => {
                navigate(-1);
            }}>Resume Game</button>
            <button onClick={() => {
                navigate('/');
            }}>Back to login</button>
        </div >
    )
}
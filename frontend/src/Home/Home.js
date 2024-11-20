import React from 'react';
import './Home.css';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserData from '../Auth/hooks/useUserData.js'; // Import the custom hook

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useUserData(); // Fetch user data using the custom hook

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Navigate back to home after logout
    };

    const handleProfileClick = () => {
        navigate('/profile'); // Navigate to profile page
    };

    return (
        <div>
            {/* Header */}
            <header>
                <div className="logo">
                    <img src={"logo192.png"} alt="logo" className="logo" />
                </div>

                <nav>
                    <div className="footer-links">
                        <ul>
                            <a href="/">Home</a>
                            <a href="#">Instructions</a>
                            <a href="#">FAQs</a>
                        </ul>
                    </div>
                </nav>
                <div className="footer-links">
                    {user.username ? (
                        <>
                            {/* Profile Picture Button */}
                            <button className="profile-button" onClick={handleProfileClick}>
                                <img
                                    src={user.profilePicture}
                                    alt="User Profile"
                                    className="profile-picture"
                                />
                            </button>
                            {/* Play Button */}
                            <button className="play-button" onClick={() => navigate('/lobby')}>
                                Play
                            </button>
                        </>
                    ) : (
                        <a href="/login">Sign Up / Log In</a>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <div className="flame-bg">
                <img src={"images/logo_with_name.png"} alt="logo" className="logo" />
            </div>

            <section className="instructions">
                <h2>INSTRUCTIONS</h2>
                <p>Dominoes is a tile game where the objective is to be the first to get rid of all your tiles or have the lowest score at the end.
                    Players take turns placing tiles, connecting matching numbers at the ends of the chain of tiles on the table.
                    If a player cannot make a move, they must skip their turn.
                    The game continues until a player runs out of tiles or no more moves are possible.
                    The winner scores points based on the tiles remaining in the opponents' hands, and the first player to reach a predetermined number of points wins the game.</p>
                <a href="#" className="instruction-link">Click here for more in-depth instructions</a>
            </section>

            {/* Leaderboard and Reviews Section */}
            <section className="content">
                {/* Leaderboard Section */}
                <div className="leaderboard">
                    <h2>WORLDWIDE LEADERBOARD</h2>
                    <div className="leaderboard-container">
                        <img src="images/leaderboard.png" className="leaderboard-img" alt="Leaderboard background"></img>
                        <div className="leaderboard-rows">
                            <div className="leaderboard-row">
                                <div className="leaderboard-column column-rank">1</div>
                                <div className="leaderboard-column column-player" title='TheTileWhisperer'>TheTileWhisperer</div>
                                <div className="leaderboard-column column-wins">24</div>
                                <div className="leaderboard-column column-losses">50</div>
                            </div>
                            <div className="leaderboard-row">
                                <div className="leaderboard-column column-rank">2</div>
                                <div className="leaderboard-column column-player" title='WittyWorm19'>WittyWorm19</div>
                                <div className="leaderboard-column column-wins">22</div>
                                <div className="leaderboard-column column-losses">80</div>
                            </div>
                            <div className="leaderboard-row">
                                <div className="leaderboard-column column-rank">3</div>
                                <div className="leaderboard-column column-player" title='BlockBuster'>BlockBuster</div>
                                <div className="leaderboard-column column-wins">22</div>
                                <div className="leaderboard-column column-losses">60</div>
                            </div>
                            <div className="leaderboard-row">
                                <div className="leaderboard-column column-rank">4</div>
                                <div className="leaderboard-column column-player" title='NarutoBoy64'>NarutoBoy64</div>
                                <div className="leaderboard-column column-wins">21</div>
                                <div className="leaderboard-column column-losses">90</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews">
                    <h2>REVIEWS / FEEDBACK</h2>
                    <div className="review-box">TheTileWhisperer: I'm so good at this game!</div>
                    <div className="review-box">EpicTileFail: Loved the experience!</div>
                    <div className="review-box">TheTileNinja: Can't wait to play again!</div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="footer-links">
                    <a href="/contact-us">Contact Us</a>
                    <a href="/faqs">Frequently Asked Questions</a>
                    <br></br>
                    <br></br>
                    <a href="/privacy-policy">Privacy Policy</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;

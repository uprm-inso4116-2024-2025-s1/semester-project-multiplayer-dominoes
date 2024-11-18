import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/validate-token`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Error validating token:', error);
                    setIsAuthenticated(false);
                }
            }
        };

        if (location.state?.authenticated) {
            setIsAuthenticated(true);
        } else {
            validateToken();
        }
    }, [location.state]);
    
    

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/'); // Regresa al Home después de logout
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
            {isAuthenticated ? (
                        <>
                            <button onClick={() => navigate('/lobby')}>Play</button>
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
                    <div class="leaderboard-container">
                        <img src="images/leaderboard.png" class="leaderboard-img" alt="Leaderboard background"></img>
                            <div class="leaderboard-rows">
                            <div class="leaderboard-row">
                                <div class="leaderboard-column column-rank">1</div>
                                <div class="leaderboard-column column-player" title='TheTileWhisperer'>TheTileWhisperer</div>
                                <div class="leaderboard-column column-wins">24</div>
                                <div class="leaderboard-column column-losses">50</div>
                            </div>
                            <div class="leaderboard-row">
                                <div class="leaderboard-column column-rank">2</div>
                                <div class="leaderboard-column column-player" title='WittyWorm19'>WittyWorm19</div>
                                <div class="leaderboard-column column-wins">22</div>
                                <div class="leaderboard-column column-losses">80</div>
                            </div>
                            <div class="leaderboard-row">
                                <div class="leaderboard-column column-rank">3</div>
                                <div class="leaderboard-column column-player" title='BlockBuster'>BlockBuster</div>
                                <div class="leaderboard-column column-wins">22</div>
                                <div class="leaderboard-column column-losses">60</div>
                            </div>
                            <div class="leaderboard-row">
                                <div class="leaderboard-column column-rank">4</div>
                                <div class="leaderboard-column column-player" title='NarutoBoy64'>NarutoBoy64</div>
                                <div class="leaderboard-column column-wins">21</div>
                                <div class="leaderboard-column column-losses">90</div>
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

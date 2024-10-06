import React from 'react';
import './Home.css'; // Assuming you have a CSS file for the styles

const Home = () => {
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
            <a href="/login">Sign Up / Log In</a>
            </div>
        </header>

        {/* Hero Section */}
            <div className="flame-bg">
            <img src={"images/logo_with_name.png"} alt="logo" className="logo" />
            </div>


        <section className="instructions">
            <h2>INSTRUCTIONS</h2>
            <p>Dominoes is a tile game where the objective is to be the first to get rid of all your tiles or have 
                the lowest score at the end. Players take turns placing tiles, connecting matching numbers at the 
                ends of the chain of tiles on the table. If you can't play, you must skip your turn. 
                The game continues until a player runs out of tiles or no more moves are possible. 
                The winner scores points based on the opponents remaining tiles, and the first player to reach a predetermined number of points wins the game.</p>
            <a href="#" className="instruction-link">Click here for more in-depth instructions</a>
        </section>


        {/* Leaderboard and Reviews Section */}
        <section className="content">
                {/* Leaderboard Section */}
                <div className="leaderboard">
                    <h2>WORLDWIDE LEADERBOARD</h2>
                    <ul>
                        <ol>
                        <li>TheTileWhisperer: 2435</li>
                        <li>WittyWorm19: 2256</li>
                        <li>BlockBuster: 2200</li>
                        <li>NarutoBoy64: 2190</li>
                        </ol>
                    </ul>
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
            <a href="#">Contact Us</a>
            <a href="#">Frequently Asked Questions</a>
            <a href="#">Privacy Policy</a>
            </div>
        </footer>
        </div>
    );
    };

    export default Home;

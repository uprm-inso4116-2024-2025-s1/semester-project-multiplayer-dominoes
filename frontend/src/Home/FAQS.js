import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const FAQS = () => (
  <div>
    <h1>Frequently Asked Questions</h1>
    <br />
    <h3>1. How do I start a game?</h3>
    <p>
      To start a game, log in, go to the lobby, and join or create a game room.
      You can play with friends or against bots.
    </p>
    <br />
    <h3>2. What are the rules of Dominoes?</h3>
    <p>
      The goal of Dominoes is to be the first player to play all of your tiles
      or have the lowest score when no moves are possible.
    </p>
    <br />
    <h3>3. Can I play with my friends?</h3>
    <p>
      Yes, you can invite friends to join a game room with you, or you can play
      solo against computer players.
    </p>
    <br />
    <h3>4. How do I report a problem?</h3>
    <p>
      If you encounter any issues, please visit our{" "}
      <a href="/contact-us">Contact Us</a> page to get in touch.
    </p>
    <br />
    <Link to="/" className="back-to-home-btn">
      Back To Home
    </Link>
  </div>
);

export default FAQS;

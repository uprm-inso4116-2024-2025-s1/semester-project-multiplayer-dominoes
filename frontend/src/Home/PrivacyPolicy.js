import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => (
  <div>
    <h1>Privacy Policy</h1>
    <p>
      Your privacy is important to us. This policy outlines how we collect, use,
      and protect your information.
    </p>
    <br />
    <h3>1. Information We Collect</h3>
    <p>
      We may collect your email, username, and any information you provide
      during gameplay.
    </p>
    <br />
    <h3>2. How We Use Your Information</h3>
    <p>
      We use your information to enhance your experience, provide customer
      support, and improve our game.
    </p>
    <br />
    <h3>3. Data Security</h3>
    <p>
      We implement measures to protect your data from unauthorized access.
      However, no data transmission over the internet can be guaranteed as 100%
      secure.
    </p>
    <br />
    <h3>4. Changes to This Policy</h3>
    <p>
      We may update this policy from time to time. Please check this page for
      the latest information.
    </p>
    <br />
    <Link to="/" className="back-to-home-btn">
      Back To Home
    </Link>
  </div>
);

export default PrivacyPolicy;

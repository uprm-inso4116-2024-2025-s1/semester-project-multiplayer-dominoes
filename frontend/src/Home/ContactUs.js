import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const ContactUs = () => (
  <div>
    <h1>Contact Us</h1>
    <p>
      If you have any questions, suggestions, or issues, feel free to reach out.
      Our team is here to help!
    </p>
    <br></br>
    <h3>Email:</h3>
    <p>support@multiplayerdominoes.com</p>
    <br></br>
    <h3>Phone:</h3>
    <p>(787)123-4567</p>
    <br></br>
    <h3>Office Hours:</h3>
    <p>Monday to Friday, 9 AM - 5 PM EST</p>
    {/* Back To Home Button */}
    <Link to="/" className="back-to-home-btn">
      Back To Home
    </Link>
  </div>
);

export default ContactUs;

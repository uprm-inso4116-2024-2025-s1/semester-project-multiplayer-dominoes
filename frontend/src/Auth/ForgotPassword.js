import React, { useState } from 'react';
import './styles/Login.css';

const playSound = () => {
  const audio = document.getElementById("clickSound");
  if (audio) {
      audio.play();
  }
};

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
        console.log('Sending password reset request for:', email);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send password reset email:', errorText);
            throw new Error('Failed to send password reset email');
        }

        setMessage('A password reset link has been sent to your email.');
    } catch (error) {
        setMessage('An error occurred. Please try again.');
        console.error(error);
    }
};


  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="header">Reset Password</h2>
        <form onSubmit={(e) => { playSound(); handlePasswordReset(e); }}>
          <input
            className="login-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" onClick={playSound}> Send Reset Link </button>
        </form>
        {message && <p className="header">{message}</p>}
      </div>
      <audio id="clickSound" src="/DominoesClick.wav" preload="auto"></audio>
    </div>
  );
}

export default ForgotPassword;

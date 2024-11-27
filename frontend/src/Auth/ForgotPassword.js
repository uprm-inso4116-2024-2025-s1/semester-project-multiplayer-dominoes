import React, { useState } from 'react';
import './styles/Login.css';
function ForgotPassword({ authService }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await authService.sendPasswordReset(email);
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
        <form onSubmit={handlePasswordReset}>
          <input
            className="login-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p className="header">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;

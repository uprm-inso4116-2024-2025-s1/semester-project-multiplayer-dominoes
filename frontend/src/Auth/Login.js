import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './services/AuthService.js';
import './styles/Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = isLogin
        ? await authService.login(email, password)
        : await authService.register(username, email, password);

      localStorage.setItem('token', data.token);
      navigate('/lobby');
    } catch (error) {
      console.warn('User not found. Please check your email and password.');
    }
  };


  return (
    <div className="login-container">
      <div className="login-form">
        <img src={"images/logo_with_name.png"} alt="logo" className="logo" />
        <h2 className="header">{isLogin ? 'Login' : 'Sign Up'} to Multi Dominoes</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p className="header">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

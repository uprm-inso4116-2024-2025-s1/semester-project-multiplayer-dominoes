import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { Link } from 'react-router-dom';

function Login({ authService }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = isLogin
        ? await authService.login(email, password)
        : await authService.register(username, email, password);

      console.log(data); 
      localStorage.setItem('token', data.token);
      navigate('/gameMode');
    } catch (error) {
      console.warn('Failed to register or login:', error);
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
        {isLogin && (
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>
        )}

      </div>
    </div>
  );
}

export default Login;

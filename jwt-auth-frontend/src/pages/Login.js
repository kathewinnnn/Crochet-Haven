import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { jwtDecode } from "jwt-decode";
import './Login.scss';

const loginStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes overlayFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.6) translateY(20px); }
    65%  { transform: scale(1.08) translateY(-4px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes spinRing {
    to { transform: rotate(360deg); }
  }
  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1;   }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes progressFill {
    from { width: 0%; }
    to   { width: 100%; }
  }

  .login-page * { scrollbar-width: none; -ms-overflow-style: none; }
  .login-page *::-webkit-scrollbar { display: none; }
  .login-page input::placeholder { color: #aaa; }
  .login-page input:-webkit-autofill,
  .login-page input:-webkit-autofill:hover,
  .login-page input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #fdf2f8 inset !important;
  }

  .overlay__backdrop {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, rgba(253,242,248,0.96) 0%, rgba(252,231,243,0.98) 50%, rgba(251,207,232,0.96) 100%);
    backdrop-filter: blur(6px);
    animation: overlayFadeIn 0.35s ease;
  }
  .overlay__card {
    background: #fff; border-radius: 24px;
    box-shadow: 0 32px 80px rgba(249,168,212,0.45), 0 0 0 1px rgba(249,168,212,0.15);
    padding: 52px 44px 44px;
    display: flex; flex-direction: column; align-items: center;
    min-width: 340px;
    animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .overlay__ring-wrap {
    position: relative; width: 96px; height: 96px; margin-bottom: 28px;
    display: flex; align-items: center; justify-content: center;
  }
  .overlay__ring-outer {
    position: absolute; inset: 0; border-radius: 50%;
    border: 3px solid transparent; border-top-color: #f472b6; border-right-color: #f9a8d4;
    animation: spinRing 1s linear infinite;
  }
  .overlay__ring-inner {
    position: absolute; inset: 10px; border-radius: 50%;
    border: 2px solid transparent; border-bottom-color: #fbcfe8; border-left-color: #ec4899;
    animation: spinRing 0.7s linear infinite reverse;
  }
  .overlay__check-circle {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, #f9a8d4, #ec4899);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(249,168,212,0.35);
  }
  .overlay__heading { margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #1f2937; font-family: 'Segoe UI', sans-serif; animation: slideUp 0.4s 0.15s both; }
  .overlay__sub     { margin: 0 0 6px; font-size: 15px; color: #6b7280; font-family: 'Segoe UI', sans-serif; animation: slideUp 0.4s 0.25s both; }
  .overlay__sub strong { color: #ec4899; }
  .overlay__redirect { margin: 0 0 24px; font-size: 13px; color: #9ca3af; font-family: 'Segoe UI', sans-serif; animation: slideUp 0.4s 0.35s both; }
  .overlay__progress-track { width: 220px; height: 5px; background: #fce7f3; border-radius: 99px; overflow: hidden; margin-bottom: 20px; animation: slideUp 0.4s 0.4s both; }
  .overlay__progress-bar {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #f9a8d4, #ec4899, #f472b6); background-size: 400px 100%;
    animation: progressFill 1.8s cubic-bezier(0.4,0,0.2,1) forwards, shimmer 1.5s linear infinite;
  }
  .overlay__dots { display: flex; gap: 8px; animation: slideUp 0.4s 0.5s both; }
  .overlay__dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, #f9a8d4, #ec4899); display: inline-block; }
  .overlay__dot:nth-child(1) { animation: dotPulse 1.2s 0s   infinite ease-in-out; }
  .overlay__dot:nth-child(2) { animation: dotPulse 1.2s 0.2s infinite ease-in-out; }
  .overlay__dot:nth-child(3) { animation: dotPulse 1.2s 0.4s infinite ease-in-out; }

  .login__container {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%);
    padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .login__card {
    background: #fff; border-radius: 20px;
    box-shadow: 0 20px 60px rgba(249,168,212,0.4);
    padding: 50px 40px; width: 100%; max-width: 420px;
    animation: fadeIn 0.5s ease-out;
  }
  .login__logo { text-align: center; margin-bottom: 10px; }
  .login__logo-icon { font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(249,168,212,0.4)); }
  .login__title { text-align: center; color: #333; font-size: 28px; font-weight: 700; margin: 0 0 8px; }
  .login__subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 35px; }
  .login__form-group { margin-bottom: 24px; }
  .login__label { display: block; color: #555; font-size: 14px; font-weight: 600; margin-bottom: 10px; }
  .login__input-wrapper { position: relative; }
  .login__input {
    width: 100%; padding: 14px 16px; font-size: 15px;
    border: 2px solid #fbcfe8; border-radius: 12px; outline: none;
    transition: all 0.3s ease; box-sizing: border-box;
    background-color: #fdf2f8; font-family: 'Segoe UI', sans-serif;
  }
  .login__input:focus, .login__input--focused {
    border-color: #f9a8d4; background-color: #fff;
    box-shadow: 0 0 0 4px rgba(249,168,212,0.2);
  }
  .login__password-toggle {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #888; font-size: 18px; padding: 5px;
  }
  .login__error-box {
    background-color: #fdf2f8; border: 1px solid #f9a8d4; border-radius: 10px;
    padding: 14px 16px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .login__error-icon { color: #ec4899; font-size: 18px; }
  .login__error-text { color: #be185d; font-size: 14px; margin: 0; }
  .login__button {
    width: 100%; padding: 16px; font-size: 16px; font-weight: 600; color: #fff;
    background: linear-gradient(135deg, #f9a8d4, #ec4899);
    border: none; border-radius: 12px; cursor: pointer;
    transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(249,168,212,0.5);
    font-family: 'Segoe UI', sans-serif; margin-top: 10px;
  }
  .login__button:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(249,168,212,0.6); transform: translateY(-2px); }
  .login__button:disabled { cursor: not-allowed; opacity: 0.7; }
  .login__register-link { text-align: center; margin-top: 25px; color: #666; font-size: 14px; }
  .login__register-link a { color: #ec4899; text-decoration: none; font-weight: 600; }
`;

const LoginSuccessOverlay = ({ username }) => (
  <div className="overlay__backdrop">
    <div className="overlay__card">
      <div className="overlay__ring-wrap">
        <div className="overlay__ring-outer" />
        <div className="overlay__ring-inner" />
        <div className="overlay__check-circle">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <polyline points="8,18 15,25 28,11" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <h2 className="overlay__heading">Login Successful!</h2>
      <p className="overlay__sub">Welcome back, <strong>{username}</strong></p>
      <p className="overlay__redirect">Redirecting you now…</p>
      <div className="overlay__progress-track">
        <div className="overlay__progress-bar" />
      </div>
      <div className="overlay__dots">
        {[0, 1, 2].map(i => <span key={i} className="overlay__dot" />)}
      </div>
    </div>
  </div>
);

const Login = () => {
  const [username,          setUsername]          = useState('');
  const [password,          setPassword]          = useState('');
  const [error,             setError]             = useState('');
  const [isLoading,         setIsLoading]         = useState(false);
  const [showPassword,      setShowPassword]      = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loginSuccess,      setLoginSuccess]      = useState(false);
  const [loggedInUser,      setLoggedInUser]      = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res     = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      const token   = res.data.token;
      const decoded = jwtDecode(token);

      // ── Save with consistent keys ──────────────────────────────────────
      // Both 'token' (legacy) and 'ch_token' so CartContext finds whichever exists.
      localStorage.setItem('token',    token);
      localStorage.setItem('ch_token', token);

      // Save the full decoded user under both key names so CartContext
      // and userStorage helpers all resolve to the same user ID.
      const userObj = { ...decoded };
      localStorage.setItem('user',    JSON.stringify(userObj));
      localStorage.setItem('ch_user', JSON.stringify(userObj));

      // ── Tell CartContext to reload for this user ────────────────────────
      window.dispatchEvent(new Event('userAuthChanged'));

      setLoggedInUser(decoded.username || username);
      setLoginSuccess(true);

      setTimeout(() => {
        if (decoded.role === 'admin') {
          navigate('/seller');
        } else {
          navigate('/user');
        }
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{loginStyles}</style>
      {loginSuccess && <LoginSuccessOverlay username={loggedInUser} />}

      <div className="login__container">
        <div className="login__card">
          <div className="login__logo">
            <div className="login__logo-icon">🔐</div>
            <h1 className="login__title">Welcome Back</h1>
            <p className="login__subtitle">Log in to continue to your dashboard</p>
          </div>

          {error && (
            <div className="login__error-box">
              <span className="login__error-icon">⚠️</span>
              <p className="login__error-text">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="login__form-group">
              <label className="login__label">👤 Username</label>
              <div className="login__input-wrapper">
                <input
                  type="text"
                  value={username}
                  required
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className={`login__input${isUsernameFocused ? ' login__input--focused' : ''}`}
                  onFocus={() => setIsUsernameFocused(true)}
                  onBlur={() => setIsUsernameFocused(false)}
                />
              </div>
            </div>

            <div className="login__form-group">
              <label className="login__label">🔒 Password</label>
              <div className="login__input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  required
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`login__input${isPasswordFocused ? ' login__input--focused' : ''}`}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <button type="button" className="login__password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="login__button">
              {isLoading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <div className="login__register-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
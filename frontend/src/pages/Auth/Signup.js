import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services';
import './Auth.scss';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await authService.signup(email, username, password);
      navigate('/');
      window.location.reload(); // Reload to update header
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__card">
          <h1 className="auth__title">Join CipherSQLStudio</h1>
          <p className="auth__subtitle">Start your SQL learning adventure today</p>

          {error && (
            <div className="auth__error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth__form">
            <div className="auth__form-group">
              <label htmlFor="email" className="auth__label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth__input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="auth__form-group">
              <label htmlFor="username" className="auth__label">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth__input"
                placeholder="Choose a username"
                required
                minLength={3}
              />
            </div>

            <div className="auth__form-group">
              <label htmlFor="password" className="auth__label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth__input"
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>

            <div className="auth__form-group">
              <label htmlFor="confirmPassword" className="auth__label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth__input"
                placeholder="Re-enter your password"
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="button button--primary button--full"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="auth__switch">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

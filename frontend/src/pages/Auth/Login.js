import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services';
import './Auth.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await authService.login(email, password);
      navigate('/');
      window.location.reload(); // Reload to update header
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__card">
          <h1 className="auth__title">Login to CipherSQLStudio</h1>
          <p className="auth__subtitle">Continue your SQL learning journey</p>

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
              <label htmlFor="password" className="auth__label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth__input"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="button button--primary button--full"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth__switch">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import './Header.scss';

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">{'{ }'}</span>
          <span className="header__logo-text">CipherSQLStudio</span>
        </Link>

        <button 
          className={`header__menu-toggle ${menuOpen ? 'header__menu-toggle--active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <Link 
            to="/" 
            className="header__nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Assignments
          </Link>
          
          {user ? (
            <>
              <span className="header__user">Hi, {user.username}!</span>
              <button 
                onClick={handleLogout} 
                className="header__nav-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="header__nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="header__nav-button"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/dashboard">
            <h2>🍎 Calorie Chronicle</h2>
          </Link>
        </div>

        <nav className="nav">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActiveRoute('/dashboard')}`}
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${isActiveRoute('/profile')}`}
              >
                🧑‍💼 Profile
              </Link>
              <div className="user-menu">
                <span className="username">Hello, {user.username}</span>
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActiveRoute('/login')}`}
              >
                🔐 Login
              </Link>
              <Link to="/register" className="btn-outline">
                📝 Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

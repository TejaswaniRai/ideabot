import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>IdeaBot</h1>
        </div>
        <nav className="nav">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </Link>
          <Link to="/generate" className={isActive('/generate') ? 'active' : ''}>
            Generate Idea
          </Link>
          <Link to="/roadmap" className={isActive('/roadmap') ? 'active' : ''}>
            Roadmap
          </Link>
          <Link to="/hackathons" className={isActive('/hackathons') ? 'active' : ''}>
            Hackathons
          </Link>
          <Link to="/judge" className={isActive('/judge') ? 'active' : ''}>
            Judge Predictor
          </Link>
          <Link to="/tech-stack" className={isActive('/tech-stack') ? 'active' : ''}>
            Tech Stack
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

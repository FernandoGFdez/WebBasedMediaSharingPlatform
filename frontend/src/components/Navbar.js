import React from 'react';
import { Search as SearchIcon, AddBox as AddBoxIcon, AccountCircle } from '@mui/icons-material';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-brand-link">
            MediaShare
          </Link>
        </div>

        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input
            className="search-input"
            placeholder="Search…"
            aria-label="search"
          />
        </div>

        <div className="navbar-actions">
          <Link to="/upload" className="icon-button">
            <AddBoxIcon />
          </Link>
          <button className="icon-button">
            <AccountCircle />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 
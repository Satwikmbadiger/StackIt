import React, { useState } from 'react';
import '../styles/Header.css';

const Header = () => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <h1>StackIt</h1>
          </div>

          {/* Navigation */}
          <nav className="nav">
            <button className="ask-question-btn">
              Ask New Question
            </button>
            
            <div className="filters">
              <button className="filter-btn active">Newest</button>
              <button className="filter-btn">Unanswered</button>
              
              <div className="filter-dropdown">
                <button 
                  className="filter-btn dropdown-toggle"
                  onClick={toggleFilterDropdown}
                >
                  More ▼
                </button>
                {filterDropdownOpen && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item">Most Voted</button>
                    <button className="dropdown-item">Most Viewed</button>
                    <button className="dropdown-item">Oldest</button>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search questions..."
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>

            {/* Login Button */}
            <button className="login-btn">Login</button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn">☰</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

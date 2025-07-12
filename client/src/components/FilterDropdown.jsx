import React, { useState, useRef, useEffect } from 'react';
import './FilterDropdown.css';

const FilterDropdown = ({ label, options, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`filter-dropdown ${className}`} ref={dropdownRef}>
      <button 
        className="filter-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {value || label}
        <span className={`filter-dropdown-arrow ${isOpen ? 'open' : ''}`}>▾</span>
      </button>
      
      {isOpen && (
        <div className="filter-dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value || option}
              className={`filter-dropdown-item ${value === (option.value || option) ? 'active' : ''}`}
              onClick={() => handleOptionSelect(option.value || option)}
            >
              {option.label || option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown; 
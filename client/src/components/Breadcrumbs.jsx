import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="breadcrumbs">
      <Link to="/" className="bc-link">Home</Link>
      {pathnames.map((name, idx) => {
        const routeTo = '/' + pathnames.slice(0, idx + 1).join('/');
        return (
          <span key={routeTo}>
            <span className="bc-sep">/</span>
            <Link to={routeTo} className="bc-link">{name.charAt(0).toUpperCase() + name.slice(1)}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

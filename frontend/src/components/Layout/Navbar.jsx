import { NavLink } from 'react-router-dom';
import { navItems } from '../../data/mockData';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        {/* Logo / Brand */}
        <div className="navbar__brand">
          <div className="navbar__logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0c0-5-8-13-8-13z" fill="#DC2626"/>
              <path d="M12 6c0 0-4 4.5-4 7.5a4 4 0 008 0c0-3-4-7.5-4-7.5z" fill="#fff" opacity="0.3"/>
            </svg>
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">BloodLink</span>
            <span className="navbar__brand-sub">LifeBlood Network</span>
          </div>
          <div className="navbar__donor-count">
            <span className="pulse-dot"></span>
            <span className="label-md">1,420 Donors Active</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="navbar__actions">
          <NavLink to="/" className="btn btn-primary navbar__cta">
            Request Blood
          </NavLink>
        </div>
      </div>
    </header>
  );
}

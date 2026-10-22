import React, { useState } from 'react';
import logoImg from '../assets/club_logo_transparent.webp';

export default function ClubHeader({ visible = false, onNavClick, onJoinClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Cosmos', href: '#cosmos' },
    { label: 'Expeditions', href: '#expeditions' },
    { label: 'Observations', href: '#observations' },
    { label: 'Events', href: '#events' },
    { label: 'About', href: '#about' }
  ];

  return (
    <header className={`club-navigation-header ${visible ? 'header-visible' : 'header-hidden'}`}>
      {/* -----------------------------------------------------------------
          1. BRAND & LOGO (LEFT)
             Using image.png as the official I²IT Astronomy Club Logo
          ----------------------------------------------------------------- */}
      <div className="header-brand-container">
        <div className="header-logo-badge" title="I²IT Astronomy Club">
          <img
            src={logoImg}
            alt="I²IT Astronomy Club Galaxy Logo"
            className="header-galaxy-logo-img"
          />
          <div className="header-logo-glow-ring" />
        </div>

        <div className="header-brand-text">
          <div className="header-club-title">
            <span className="brand-i2it">I²IT</span>
            <span className="brand-sep"> </span>
            <span className="brand-astronomy">ASTRONOMY</span>
            <span className="brand-sep"> </span>
            <span className="brand-club">CLUB</span>
          </div>
          <div className="header-club-subtitle">
            <span>HOPE FOUNDATION</span>
            <span className="sub-dot">•</span>
            <span>HINJAWADI, PUNE</span>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          2. NAVIGATION LINKS (CENTER)
          ----------------------------------------------------------------- */}
      <nav className="header-nav-center" aria-label="Main navigation">
        <ul className="header-nav-list">
          {navItems.map((item, index) => (
            <li key={index} className="header-nav-item">
              <a
                href={item.href}
                className="header-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavClick) onNavClick(item.label.toLowerCase());
                }}
              >
                <span>{item.label}</span>
                <span className="nav-hover-line" />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* -----------------------------------------------------------------
          3. CTA BUTTON (RIGHT)
          ----------------------------------------------------------------- */}
      <div className="header-actions-right">
        {/* Join CTA */}
        <button
          className="header-cta-btn"
          onClick={() => {
            if (onJoinClick) onJoinClick();
          }}
          aria-label="Join Astronomy Club"
        >
          <span className="cta-icon">✦</span>
          <span>JOIN CLUB</span>
        </button>

        {/* Mobile Hamburger Button */}
        <button
          className="header-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* -----------------------------------------------------------------
          4. MOBILE DRAWER NAVIGATION
          ----------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="header-mobile-drawer">
          <ul className="mobile-nav-list">
            {navItems.map((item, index) => (
              <li key={index} className="mobile-nav-item">
                <a
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-drawer-footer">
            <button
              className="header-cta-btn full-width"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onJoinClick) onJoinClick();
              }}
            >
              <span>JOIN CLUB</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

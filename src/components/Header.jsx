import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu or scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <header className={`header ${isScrolled || location.pathname !== '/' ? 'scrolled glass-nav' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="Tasty Bites" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li><Link to="/menu">Place your Order</Link></li>
            <li><Link to="/book">Book a Table</Link></li>
            <li><Link to="/catering">Catering</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
          </ul>
        </nav>

        <div className="header-cta">
          <Link to="/book" className="btn btn-primary">Book a Table</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

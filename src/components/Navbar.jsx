import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X, FlaskConical } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? '12px 0' : '20px 0',
      background: scrolled ? 'rgba(2,4,8,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,200,255,0.1)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img 
            src="/astryx-logo.png" 
            alt="Astryx Logo" 
            style={{ 
              width: 48, 
              height: 48, 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(0, 200, 255, 0.5))'
            }} 
          />
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span className="gradient-text">ASTRYX</span>
            <span style={{ color: '#e8f4ff', fontWeight: 300 }}> LABS</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          <a href="#experiments" className="nav-link" style={{ fontSize: '0.95rem' }}>Experiments</a>
          <a href="#features" className="nav-link" style={{ fontSize: '0.95rem' }}>Features</a>
          <a href="#about" className="nav-link" style={{ fontSize: '0.95rem' }}>About</a>
          <Link to="/#experiments" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FlaskConical size={16} />
              Enter Lab
            </span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', color: '#e8f4ff', padding: 8,
        }} className="mobile-toggle">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(2,4,8,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,200,255,0.1)',
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <a href="#experiments" className="nav-link" onClick={() => setMenuOpen(false)}>Experiments</a>
          <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#about" className="nav-link" onClick={() => setMenuOpen(false)}>About</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

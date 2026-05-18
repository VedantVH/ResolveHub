import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, AlertTriangle, LayoutDashboard, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <div style={styles.logoGlow}></div>
        <span style={styles.logoText}>ResolveHub 🏆</span>
      </div>
      
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link to="/leaves" style={styles.link}>
          <Calendar size={18} />
          Leaves
        </Link>
        <Link to="/complaints" style={styles.link}>
          <AlertTriangle size={18} />
          Complaints
        </Link>
      </div>

      <div style={styles.profileArea}>
        <div style={styles.userInfo}>
          <User size={16} style={styles.userIcon} />
          <div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>{user.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 4rem',
    background: 'rgba(18, 20, 32, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: '40px',
    height: '40px',
    background: 'var(--primary)',
    filter: 'blur(20px)',
    opacity: 0.6,
    zIndex: -1,
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 30%, var(--primary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'var(--transition-smooth)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  },
  profileArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderRight: '1px solid var(--border)',
    paddingRight: '1.5rem',
  },
  userIcon: {
    background: 'var(--primary-glow)',
    color: 'var(--primary)',
    padding: '8px',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  userRole: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
  }
};

export default Navbar;

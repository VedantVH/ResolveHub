import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, Shield } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Get started with ResolveHub platform</p>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={styles.inputWrapper}>
            <label className="form-label">Full Name</label>
            <div style={styles.iconContainer}>
              <User size={18} style={styles.icon} />
              <input 
                type="text" 
                className="form-input" 
                style={styles.input} 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={styles.inputWrapper}>
            <label className="form-label">Email Address</label>
            <div style={styles.iconContainer}>
              <Mail size={18} style={styles.icon} />
              <input 
                type="email" 
                className="form-input" 
                style={styles.input} 
                placeholder="you@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={styles.inputWrapper}>
            <label className="form-label">Password</label>
            <div style={styles.iconContainer}>
              <Lock size={18} style={styles.icon} />
              <input 
                type="password" 
                className="form-input" 
                style={styles.input} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={styles.inputWrapper}>
            <label className="form-label">Select Role</label>
            <div style={styles.iconContainer}>
              <Shield size={18} style={styles.icon} />
              <select 
                className="form-input" 
                style={styles.input} 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="USER">Employee (User)</option>
                <option value="ADMIN">HR Specialist (Admin)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : <><UserCheck size={18} /> Register</>}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Already have an account? </span>
          <Link to="/login" style={styles.link}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    position: 'relative',
  },
  glow1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'rgba(99, 102, 241, 0.2)',
    filter: 'blur(80px)',
    top: '10%',
    left: '25%',
    borderRadius: '50%',
    zIndex: -1,
  },
  glow2: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    background: 'rgba(16, 185, 129, 0.15)',
    filter: 'blur(100px)',
    bottom: '10%',
    right: '25%',
    borderRadius: '50%',
    zIndex: -1,
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '2.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #fff 60%, var(--primary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  error: {
    background: 'var(--danger-glow)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'var(--danger)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  inputWrapper: {
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  input: {
    paddingLeft: '2.75rem',
  },
  submitBtn: {
    width: '100%',
    marginTop: '1rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: '600',
  }
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { AlertTriangle, Send, FileText } from 'lucide-react';

const ComplaintForm = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const url = user.role === 'ADMIN' ? '/api/complaints/all' : '/api/complaints/my';
      const response = await axios.get(`http://localhost:8080${url}`);
      setHistory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/complaints', { subject, description });
      showToast('Grievance filed successfully! HR will review it.', 'success');
      setSubject('');
      setDescription('');
      fetchHistory();
    } catch (err) {
      showToast('Failed to file complaint. Try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={styles.container}>
      {user.role === 'USER' && (
        <div className="glass-card" style={styles.formSection}>
          <div style={styles.sectionHeader}>
            <AlertTriangle size={22} style={{ color: 'var(--primary)' }} />
            <h2 style={styles.title}>Raise a Complaint</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Briefly state the issue..."
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea 
                className="form-input" 
                rows="5" 
                placeholder="Describe your issue or grievance in detail..."
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Filing...
                </>
              ) : (
                <>
                  <Send size={16} /> File Complaint
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <div className="glass-card" style={styles.historySection}>
        <div style={styles.sectionHeader}>
          <FileText size={22} style={{ color: 'var(--primary)' }} />
          <h2 style={styles.title}>{user.role === 'ADMIN' ? 'All Grievance Logs' : 'My Filed Grievances'}</h2>
        </div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                {user.role === 'ADMIN' && <th style={styles.th}>Applicant</th>}
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Filed Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyCell}>No records available</td>
                </tr>
              ) : (
                history.map(item => (
                  <tr key={item.id} style={styles.trBody}>
                    {user.role === 'ADMIN' && <td style={styles.td}>{item.applicantName}</td>}
                    <td style={styles.td} style={{ fontWeight: '600' }}>{item.subject}</td>
                    <td style={styles.td}>{item.description}</td>
                    <td style={styles.td}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <span className={`badge badge-${item.status === 'OPEN' ? 'open' : 'resolved'}`}>{item.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  formSection: {
    maxWidth: '650px',
    width: '100%',
    margin: '0 auto',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
  },
  successMessage: {
    background: 'var(--success-glow)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--success)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  historySection: {
    width: '100%',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  trHead: {
    borderBottom: '1px solid var(--border)',
  },
  th: {
    padding: '1rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  trBody: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    background: 'rgba(10, 11, 16, 0.2)',
  },
  td: {
    padding: '1.25rem 1rem',
    fontSize: '0.95rem',
  },
  emptyCell: {
    textAlign: 'center',
    padding: '2.5rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  }
};

export default ComplaintForm;

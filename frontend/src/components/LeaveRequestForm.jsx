import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Calendar, Plus, FileText, Send } from 'lucide-react';

const LeaveRequestForm = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchHistory = async () => {
    try {
      const url = user.role === 'ADMIN' ? '/api/leaves/all' : '/api/leaves/my';
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
    setValidationErrors({});
    try {
      await axios.post('http://localhost:8080/api/leaves', { startDate, endDate, reason });
      showToast('Leave request filed successfully!', 'success');
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchHistory();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.validationErrors) {
        setValidationErrors(err.response.data.validationErrors);
        showToast('Submission rejected by custom Java JSR-380 validator.', 'error');
      } else {
        showToast(err.response?.data?.message || 'Failed to submit leave request.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={styles.container}>
      {user.role === 'USER' && (
        <div className="glass-card" style={styles.formSection}>
          <div style={styles.sectionHeader}>
            <Calendar size={22} style={{ color: 'var(--primary)' }} />
            <h2 style={styles.title}>Apply for Leave</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {validationErrors.startDate && (
              <div style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1rem', background: 'var(--danger-glow)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', fontWeight: '500' }}>
                ⚠️ Validation Rejected: {validationErrors.startDate}
              </div>
            )}
            <div style={styles.dateRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Leave</label>
              <textarea 
                className="form-input" 
                rows="4" 
                placeholder="Explain the reason for leave..."
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                <>
                  <Send size={16} /> Submit Leave Request
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <div className="glass-card" style={styles.historySection}>
        <div style={styles.sectionHeader}>
          <FileText size={22} style={{ color: 'var(--primary)' }} />
          <h2 style={styles.title}>{user.role === 'ADMIN' ? 'All Leave Records' : 'My Leave Request History'}</h2>
        </div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                {user.role === 'ADMIN' && <th style={styles.th}>Applicant</th>}
                <th style={styles.th}>Start Date</th>
                <th style={styles.th}>End Date</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyCell}>No history available</td>
                </tr>
              ) : (
                history.map(item => (
                  <tr key={item.id} style={styles.trBody}>
                    {user.role === 'ADMIN' && <td style={styles.td}>{item.applicantName}</td>}
                    <td style={styles.td}>{item.startDate}</td>
                    <td style={styles.td}>{item.endDate}</td>
                    <td style={styles.td}>{item.reason}</td>
                    <td style={styles.td}>
                      <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
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
  dateRow: {
    display: 'flex',
    gap: '1rem',
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

export default LeaveRequestForm;

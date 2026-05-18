import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Calendar, AlertTriangle, CheckCircle, Clock, Plus, BarChart2, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const isSearchAdmin = user.role === 'ADMIN';
      const leavesUrl = isSearchAdmin ? '/api/leaves/all' : '/api/leaves/my';
      const complaintsUrl = isSearchAdmin ? '/api/complaints/all' : '/api/complaints/my';

      const [leavesRes, complaintsRes] = await Promise.all([
        axios.get(`http://localhost:8080${leavesUrl}`),
        axios.get(`http://localhost:8080${complaintsUrl}`)
      ]);

      setLeaves(leavesRes.data);
      setComplaints(complaintsRes.data);

      if (isSearchAdmin) {
        try {
          const metricsRes = await axios.get('http://localhost:8080/api/admin/metrics');
          setMetrics(metricsRes.data);
        } catch (metErr) {
          console.warn('Failed to fetch runtime telemetry', metErr);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
      showToast('Failed to load real-time database records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleLeaveStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8080/api/leaves/${id}/status?status=${status}`);
      showToast(`Leave application successfully ${status.toLowerCase()}!`, 'success');
      fetchDashboardData();
    } catch (error) {
      showToast('Failed to update leave request status.', 'error');
    }
  };

  const handleResolveComplaint = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/complaints/${id}/resolve`);
      showToast('Grievance resolved successfully!', 'success');
      fetchDashboardData();
    } catch (error) {
      showToast('Failed to mark complaint as resolved.', 'error');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading Dashboard...</div>;
  }

  // Analytics helper calculations
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
  const approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;
  const activeComplaints = complaints.filter(c => c.status === 'OPEN').length;

  return (
    <div className="main-content">
      {/* Welcome Banner */}
      <div className="glass-card" style={styles.welcomeBanner}>
        <div>
          <h1 style={styles.welcomeTitle}>Hello, {user.name} 👋</h1>
          <p style={styles.welcomeSubtitle}>
            {user.role === 'ADMIN' 
              ? 'Manage and coordinate organizational leaves and concerns efficiently.' 
              : 'Apply for leaves, raise complaints, and track your history all in one place.'}
          </p>
        </div>
        {user.role === 'USER' && (
          <div style={styles.welcomeActions}>
            <Link to="/leaves" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              <Plus size={16} /> Apply Leave
            </Link>
            <Link to="/complaints" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              <Plus size={16} /> File Complaint
            </Link>
          </div>
        )}
      </div>

      {/* Analytics Grid */}
      <div style={styles.analyticsGrid}>
        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIconContainer, background: 'var(--warning-glow)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>{user.role === 'ADMIN' ? 'Pending Approvals' : 'My Pending Leaves'}</div>
            <div style={styles.statVal}>{pendingLeaves}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIconContainer, background: 'var(--success-glow)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>{user.role === 'ADMIN' ? 'Approved Leaves' : 'Approved Requests'}</div>
            <div style={styles.statVal}>{approvedLeaves}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIconContainer, background: 'var(--danger-glow)', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>{user.role === 'ADMIN' ? 'Open Issues' : 'My Active Issues'}</div>
            <div style={styles.statVal}>{activeComplaints}</div>
          </div>
        </div>
      </div>

      {/* Spring Boot Live Telemetry Console (AOP Profiler Insights) */}
      {user.role === 'ADMIN' && (
        <div className="glass-card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(18, 20, 32, 0.7) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <Cpu size={22} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Spring Boot Runtime Telemetry <span style={{ fontSize: '0.75rem', color: 'var(--success)', marginLeft: '0.5rem', background: 'var(--success-glow)', padding: '0.15rem 0.5rem', borderRadius: '99px', border: '1px solid rgba(16,185,129,0.2)' }}>AOP Profiler Active</span></h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Aspect-Oriented Programming (AOP) metrics dynamically monitoring database queries, mail deliveries, and business service performance benchmarks.
          </p>
          <div className="telemetry-grid">
            {Object.keys(metrics).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', gridColumn: '1 / -1', textAlign: 'center', padding: '1rem' }}>
                Awaiting service layer executions to collect initial profiling metrics...
              </div>
            ) : (
              Object.entries(metrics).map(([method, duration]) => (
                <div key={method} className="telemetry-card">
                  <div className="telemetry-header" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={method}>
                    {method.replace('Service.', 'Svc.')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span className="telemetry-value">{duration}</span>
                    <span className="telemetry-unit">ms</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Split Lists view */}
      <div style={styles.listsContainer}>
        {/* Leave Requests Section */}
        <div className="glass-card" style={styles.listSection}>
          <div style={styles.sectionHeader}>
            <Calendar size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={styles.sectionTitle}>{user.role === 'ADMIN' ? 'Recent Leave Requests' : 'My Recent Leaves'}</h2>
          </div>
          <div style={styles.list}>
            {leaves.length === 0 ? (
              <p style={styles.emptyText}>No leaves found.</p>
            ) : (
              leaves.map(leave => (
                <div key={leave.id} style={styles.listItem}>
                  <div style={styles.listItemMeta}>
                    {user.role === 'ADMIN' && <div style={styles.userName}>{leave.applicantName}</div>}
                    <div style={styles.leaveDuration}>
                      {leave.startDate} to {leave.endDate}
                    </div>
                    <div style={styles.leaveReason}>"{leave.reason}"</div>
                  </div>
                  <div style={styles.listItemActions}>
                    <span className={`badge badge-${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                    {user.role === 'ADMIN' && leave.status === 'PENDING' && (
                      <div style={styles.actionButtons}>
                        <button 
                          onClick={() => handleLeaveStatusUpdate(leave.id, 'APPROVED')} 
                          className="btn btn-primary"
                          style={styles.actionBtn}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleLeaveStatusUpdate(leave.id, 'REJECTED')} 
                          className="btn btn-danger"
                          style={styles.actionBtn}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Complaints Section */}
        <div className="glass-card" style={styles.listSection}>
          <div style={styles.sectionHeader}>
            <AlertTriangle size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={styles.sectionTitle}>{user.role === 'ADMIN' ? 'Organizational Complaints' : 'My Raised Complaints'}</h2>
          </div>
          <div style={styles.list}>
            {complaints.length === 0 ? (
              <p style={styles.emptyText}>No complaints filed.</p>
            ) : (
              complaints.map(complaint => (
                <div key={complaint.id} style={styles.listItem}>
                  <div style={styles.listItemMeta}>
                    {user.role === 'ADMIN' && <div style={styles.userName}>{complaint.applicantName}</div>}
                    <div style={styles.complaintSubject}>{complaint.subject}</div>
                    <div style={styles.leaveReason}>{complaint.description}</div>
                  </div>
                  <div style={styles.listItemActions}>
                    <span className={`badge badge-${complaint.status === 'OPEN' ? 'open' : 'resolved'}`}>
                      {complaint.status}
                    </span>
                    {user.role === 'ADMIN' && complaint.status === 'OPEN' && (
                      <button 
                        onClick={() => handleResolveComplaint(complaint.id)} 
                        className="btn btn-primary"
                        style={styles.actionBtn}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
  },
  welcomeBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2.5rem',
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(18, 20, 32, 0.7) 100%)',
  },
  welcomeTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
  },
  welcomeSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
  welcomeActions: {
    display: 'flex',
    gap: '1rem',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem 2rem',
  },
  statIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '14px',
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  statVal: {
    fontSize: '1.8rem',
    fontWeight: '800',
    marginTop: '0.25rem',
  },
  listsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '2rem',
  },
  listSection: {
    padding: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.25rem',
    background: 'rgba(10, 11, 16, 0.4)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    transition: 'var(--transition-smooth)',
  },
  listItemMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  userName: {
    fontWeight: '700',
    fontSize: '0.9rem',
    color: 'var(--primary)',
  },
  leaveDuration: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  complaintSubject: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  leaveReason: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  },
  listItemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.75rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.8rem',
  },
  emptyText: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    padding: '2rem 0',
  }
};

export default Dashboard;

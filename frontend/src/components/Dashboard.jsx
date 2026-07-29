import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Calendar, AlertTriangle, CheckCircle, Clock, Plus, Cpu, Activity, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LeaveAnalyticsChart, TelemetryBarChart } from './AnalyticsCharts';
import ExportCSVButton from './ExportCSVButton';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

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
    return (
      <div style={styles.loading}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Activity size={32} style={{ color: 'var(--primary)' }} />
        </motion.div>
        <span style={{ marginLeft: '1rem' }}>Initializing High-Performance Portal...</span>
      </div>
    );
  }

  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
  const approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;
  const activeComplaints = complaints.filter(c => c.status === 'OPEN').length;

  const filteredLeaves = leaves.filter(l => 
    (l.reason && l.reason.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (l.applicantName && l.applicantName.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <motion.div 
      className="main-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Editorial Welcome Hero Banner */}
      <motion.div 
        className="glass-card hero-card" 
        style={styles.welcomeBanner}
        whileHover={{ scale: 1.005 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-orange)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-orange)' }}>Enterprise Workflow Portal</span>
          </div>
          <h1 style={styles.welcomeTitle}>Welcome back, {user.name} 👋</h1>
          <p style={styles.welcomeSubtitle}>
            {user.role === 'ADMIN' 
              ? 'Real-time telemetry, leave request pipeline, and grievance resolution hub.' 
              : 'Apply for leaves, raise complaints, and track real-time resolution metrics.'}
          </p>
        </div>
        {user.role === 'USER' && (
          <div style={styles.welcomeActions}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/leaves" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <Plus size={16} /> Apply Leave
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/complaints" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                <Plus size={16} /> File Grievance
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Analytics Widget Grid */}
      <div style={styles.analyticsGrid}>
        <motion.div className="glass-card" style={styles.statCard} whileHover={{ y: -4 }}>
          <div style={{ ...styles.statIconContainer, background: '#fde8d7', color: '#c25e00' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>{user.role === 'ADMIN' ? 'Pending Approvals' : 'My Pending Leaves'}</div>
            <div style={styles.statVal}>{pendingLeaves}</div>
          </div>
        </motion.div>

        <motion.div className="glass-card" style={styles.statCard} whileHover={{ y: -4 }}>
          <div style={{ ...styles.statIconContainer, background: '#e6f0e1', color: '#3b6624' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>{user.role === 'ADMIN' ? 'Approved Leaves' : 'Approved Requests'}</div>
            <div style={styles.statVal}>{approvedLeaves}</div>
          </div>
        </motion.div>

        <motion.div className="glass-card" style={styles.statCard} whileHover={{ y: -4 }}>
          <div style={{ ...styles.statIconContainer, background: '#fbe3dc', color: '#b83a1b' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>{user.role === 'ADMIN' ? 'Open Grievances' : 'My Active Issues'}</div>
            <div style={styles.statVal}>{activeComplaints}</div>
          </div>
        </motion.div>
      </div>

      {/* Chart.js Analytics & AOP Telemetry Section */}
      <div style={{ display: 'grid', gridTemplateColumns: user.role === 'ADMIN' ? '1fr 1fr' : '1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <motion.div className="glass-card" style={{ padding: '2rem' }} whileHover={{ y: -3 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Leave Trends & Analytics</h2>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', background: 'var(--primary-glow)', padding: '0.2rem 0.6rem', borderRadius: '99px' }}>Live Trends</span>
          </div>
          <LeaveAnalyticsChart leaves={leaves} />
        </motion.div>

        {user.role === 'ADMIN' && (
          <motion.div className="glass-card" style={{ padding: '2rem' }} whileHover={{ y: -3 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Cpu size={20} style={{ color: 'var(--accent-orange)' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Spring AOP Telemetry Latency</h2>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b83a1b', background: '#fbe3dc', padding: '0.2rem 0.6rem', borderRadius: '99px' }}>Service Profiler</span>
            </div>
            <TelemetryBarChart metrics={metrics} />
          </motion.div>
        )}
      </div>

      {/* Main Filter & Data Lists */}
      <div style={styles.listsContainer}>
        {/* Leave Requests Section */}
        <motion.div className="glass-card" style={styles.listSection} layout>
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={styles.sectionTitle}>{user.role === 'ADMIN' ? 'Recent Leave Requests' : 'My Recent Leaves'}</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Filter size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Filter records..." 
                  value={searchFilter} 
                  onChange={(e) => setSearchFilter(e.target.value)} 
                  style={{ padding: '0.4rem 0.8rem 0.4rem 2rem', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '0.85rem', width: '160px' }}
                />
              </div>
              <ExportCSVButton data={filteredLeaves} filename="leave_requests.csv" label="CSV Export" />
            </div>
          </div>
          <div style={styles.list}>
            <AnimatePresence>
              {filteredLeaves.length === 0 ? (
                <p style={styles.emptyText}>No matching leave records found.</p>
              ) : (
                filteredLeaves.map(leave => (
                  <motion.div 
                    key={leave.id} 
                    style={styles.listItem}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    whileHover={{ scale: 1.01, backgroundColor: '#fdfbf7' }}
                  >
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
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Complaints Section */}
        <motion.div className="glass-card" style={styles.listSection} layout>
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={20} style={{ color: 'var(--accent-orange)' }} />
              <h2 style={styles.sectionTitle}>{user.role === 'ADMIN' ? 'Organizational Complaints' : 'My Raised Complaints'}</h2>
            </div>
            <ExportCSVButton data={complaints} filename="complaints.csv" label="CSV Export" />
          </div>
          <div style={styles.list}>
            <AnimatePresence>
              {complaints.length === 0 ? (
                <p style={styles.emptyText}>No complaints filed.</p>
              ) : (
                complaints.map(complaint => (
                  <motion.div 
                    key={complaint.id} 
                    style={styles.listItem}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    whileHover={{ scale: 1.01, backgroundColor: '#fdfbf7' }}
                  >
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
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  welcomeBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2.5rem',
    marginBottom: '2rem',
  },
  welcomeTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
    marginBottom: '0.4rem',
    color: 'var(--text-primary)',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2.5rem',
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
    borderRadius: '18px',
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: '700',
  },
  statVal: {
    fontSize: '2rem',
    fontWeight: '800',
    marginTop: '0.2rem',
    color: 'var(--text-primary)',
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
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    borderBottom: '1.5px solid var(--border)',
    paddingBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
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
    background: '#ffffff',
    border: '1.5px solid var(--border)',
    borderRadius: '16px',
    transition: 'all 0.2s ease',
  },
  listItemMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  userName: {
    fontWeight: '800',
    fontSize: '0.9rem',
    color: 'var(--primary)',
  },
  leaveDuration: {
    fontSize: '1rem',
    fontWeight: '700',
  },
  complaintSubject: {
    fontSize: '1rem',
    fontWeight: '700',
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

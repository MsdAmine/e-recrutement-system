import React, { useState, useEffect } from 'react';
import applicationService from '../../services/applicationService';
import notificationService from '../../services/notificationService';
import { Briefcase, Bell, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apps, notes] = await Promise.all([
          applicationService.getMyApplications(),
          notificationService.getUnread()
        ]);
        setApplications(apps);
        setNotifications(notes);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'var(--success)';
      case 'REJECTED': return 'var(--error)';
      case 'IN_REVIEW': return 'var(--warning)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED': return <CheckCircle2 size={16} />;
      case 'REJECTED': return <XCircle size={16} />;
      case 'IN_REVIEW': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your dashboard...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card glass">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Applications</p>
          <h2 style={{ fontSize: '2rem' }}>{applications.length}</h2>
        </div>
        <div className="card glass">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Pending Offers</p>
          <h2 style={{ fontSize: '2rem' }}>{applications.filter(a => a.status === 'PENDING' || a.status === 'IN_REVIEW').length}</h2>
        </div>
        <div className="card glass">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Unread Notifications</p>
          <h2 style={{ fontSize: '2rem' }}>{notifications.length}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Applications List */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} className="gradient-text" /> 
            My Applications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.length > 0 ? (
              applications.map(app => (
                <div key={app.id} style={{ 
                  padding: '1.25rem', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{app.jobOfferTitle}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    color: getStatusColor(app.status),
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    background: `${getStatusColor(app.status)}15`
                  }}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No applications yet. Go find some jobs!</p>
            )}
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="card glass">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} className="gradient-text" />
            Recents
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.slice(0, 5).map(note => (
              <div key={note.id} style={{ 
                fontSize: '0.85rem', 
                padding: '0.8rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'rgba(255,255,255,0.02)',
                borderLeft: '3px solid var(--accent-primary)'
              }}>
                <p style={{ marginBottom: '0.25rem' }}>{note.message}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {notifications.length === 0 && (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>All caught up!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;

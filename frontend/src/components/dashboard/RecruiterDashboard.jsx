import React, { useState, useEffect } from 'react';
import jobOfferService from '../../services/jobOfferService';
import applicationService from '../../services/applicationService';
import { Plus, Users, FileText, ChevronRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobs, apps] = await Promise.all([
          jobOfferService.getMyOffers(),
          applicationService.getRecruiterApplications()
        ]);
        setMyJobs(jobs);
        setRecentApplications(apps);
      } catch (error) {
        console.error('Failed to fetch recruiter dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your dashboard...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Recruiter <span className="gradient-text">Console</span></h2>
        <Link to="/post-job" className="glass" style={{ 
          padding: '0.6rem 1.25rem', 
          borderRadius: 'var(--radius-md)', 
          background: 'var(--accent-gradient)',
          color: 'white',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none'
        }}>
          <Plus size={18} /> Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card glass">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Job Offers</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Briefcase className="gradient-text" size={32} />
            <h2 style={{ fontSize: '2rem' }}>{myJobs.filter(j => j.active).length}</h2>
          </div>
        </div>
        <div className="card glass">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Applications</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Users className="gradient-text" size={32} />
            <h2 style={{ fontSize: '2rem' }}>{recentApplications.length}</h2>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* My Jobs List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} className="gradient-text" /> 
              My Job Offers
            </h3>
            <Link to="/my-jobs" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myJobs.slice(0, 5).map(job => (
              <div key={job.id} style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>{job.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{job.location} • {job.contractType}</p>
                </div>
                <ChevronRight size={18} color="var(--text-tertiary)" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} className="gradient-text" /> 
              Recent Applicants
            </h3>
            <Link to="/recruiter-applications" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentApplications.slice(0, 5).map(app => (
              <div key={app.id} style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>{app.candidateEmail}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Applied for: {app.jobOfferTitle}</p>
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.6rem', 
                  borderRadius: '12px', 
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border)' 
                }}>
                  {app.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import jobOfferService from '../services/jobOfferService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, DollarSign, Clock, Calendar, ChevronLeft, Send, AlertCircle, CheckCircle } from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobOfferService.getById(id);
        setJob(data);
      } catch (err) {
        setError('Job not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setApplying(true);
    setApplyError('');
    
    try {
      await api.post(`/applications/job-offers/${id}`, { coverLetter });
      setApplySuccess(true);
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading job details...</div>;
  if (error) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
      <div className="card" style={{ borderColor: 'var(--error)' }}>
        <p style={{ color: 'var(--error)' }}>{error}</p>
        <Link to="/jobs" style={{ marginTop: '1rem', display: 'inline-block', color: 'var(--accent-primary)' }}>Back to Job List</Link>
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        <ChevronLeft size={20} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>{job.title}</h1>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  background: 'var(--accent-gradient)', 
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>{job.contractType}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} /> {job.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={18} /> {job.salary ? `${job.salary.toLocaleString()} MAD` : 'Competitive'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} /> Posted on {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Job Description</h3>
              <div style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap'
              }}>
                {job.description}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Apply Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card glass" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Apply for this position</h3>
            
            {!user ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  You need to be signed in as a candidate to apply.
                </p>
                <Link to="/login" className="glass" style={{ 
                  display: 'block', 
                  padding: '0.875rem', 
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>Sign in to Apply</Link>
              </div>
            ) : user.role !== 'ROLE_CANDIDATE' ? (
              <div style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'rgba(245, 158, 11, 0.1)', 
                border: '1px solid var(--warning)',
                color: 'var(--warning)',
                fontSize: '0.9rem'
              }}>
                Only candidates can apply to job offers.
              </div>
            ) : applySuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  color: 'var(--success)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <CheckCircle size={32} />
                </div>
                <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Application Sent!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Your application has been successfully submitted. The recruiter will be notified.
                </p>
                <Link to="/dashboard" style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.9rem' }}>Track Applications</Link>
              </div>
            ) : (
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applyError && (
                  <div style={{ 
                    padding: '0.75rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid var(--error)',
                    color: 'var(--error)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={16} /> {applyError}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cover Letter</label>
                  <textarea 
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the recruiter why you're a good fit..."
                    style={{ 
                      minHeight: '150px', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      color: 'white',
                      resize: 'vertical'
                    }}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={applying}
                  style={{ 
                    padding: '0.875rem', 
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--accent-gradient)',
                    color: 'white',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: applying ? 0.7 : 1
                  }}
                >
                  {applying ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
                </button>
              </form>
            )}
            
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                Job ID: {id} • Posted by {job.recruiterEmail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;

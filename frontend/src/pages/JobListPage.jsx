import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobOfferService from '../services/jobOfferService';
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, ArrowRight } from 'lucide-react';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobOfferService.getAll();
        setJobs(data);
      } catch (err) {
        setError('Failed to load job offers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Explore <span className="gradient-text">Opportunities</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Find your next career move from our curated list of technical roles.</p>
      </header>

      {/* Search Bar */}
      <div className="glass" style={{ 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-xl)', 
        marginBottom: '3rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={20} />
          <input 
            type="text" 
            placeholder="Search by title, location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass"
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem 0.75rem 3rem', 
              borderRadius: 'var(--radius-lg)', 
              color: 'white',
              border: 'none'
            }}
          />
        </div>
        <button className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Loading amazing opportunities...</div>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', borderColor: 'var(--error)' }}>
          <p style={{ color: 'var(--error)' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', color: 'var(--accent-primary)' }}>Try Again</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="card" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '2rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{job.title}</h3>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      color: 'var(--accent-primary)',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>{job.contractType}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} /> {job.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <DollarSign size={16} /> {job.salary ? `${job.salary.toLocaleString()} MAD` : 'Competitive'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={16} /> {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Link to={`/jobs/${job.id}`} className="glass" style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'var(--accent-gradient)',
                  color: 'white'
                }}>
                  <ArrowRight size={24} />
                </Link>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jobOfferService from '../services/jobOfferService';
import { Briefcase, MapPin, DollarSign, Clock, FileText, Send, AlertCircle, ChevronLeft } from 'lucide-react';

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    contractType: 'FULL_TIME',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await jobOfferService.createOffer(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create job offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Post a <span className="gradient-text">New Job</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fill in the details to find your next great hire.</p>
        </header>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontWeight: '600' }}>Job Title</label>
            <div style={{ position: 'relative' }}>
              <Briefcase style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={18} />
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Software Engineer, Product Manager..."
                required
                className="glass-input"
                style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: 'var(--radius-xl)', color: 'white', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ fontWeight: '600' }}>Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={18} />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Paris, France (Remote)"
                  required
                  className="glass-input"
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: 'var(--radius-xl)', color: 'white', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ fontWeight: '600' }}>Contract Type</label>
              <div style={{ position: 'relative' }}>
                <Clock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={18} />
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: 'var(--radius-xl)', color: 'white', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', outline: 'none', appearance: 'none' }}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontWeight: '600' }}>Salary Range</label>
            <div style={{ position: 'relative' }}>
              <DollarSign style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={18} />
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 50k - 70k EUR"
                required
                className="glass-input"
                style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: 'var(--radius-xl)', color: 'white', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontWeight: '600' }}>Job Description</label>
            <div style={{ position: 'relative' }}>
              <FileText style={{ position: 'absolute', left: '1.2rem', top: '1.2rem', color: 'var(--accent-primary)' }} size={18} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and team..."
                required
                rows={5}
                className="glass-input"
                style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: 'var(--radius-xl)', color: 'white', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontWeight: '600' }}>Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the required skills, experience, and qualifications..."
              required
              rows={4}
              className="glass-input"
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-xl)', color: 'white', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass"
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--accent-gradient)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              opacity: loading ? 0.7 : 1,
              marginTop: '1rem'
            }}
          >
            {loading ? 'Posting...' : <><Send size={20} /> Publish Job Offer</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;

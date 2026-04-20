import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { UserPlus, Mail, Lock, User, Briefcase, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [role, setRole] = useState('candidate'); // 'candidate' or 'recruiter'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (role === 'candidate') {
        const { companyName, ...candidateData } = formData;
        data = await authService.registerCandidate(candidateData);
      } else {
        data = await authService.registerRecruiter(formData);
      }

      login(
        { 
          id: data.userId, 
          firstName: data.firstName, 
          lastName: data.lastName, 
          email: data.email, 
          role: data.role 
        }, 
        data.token
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: '2rem 0'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            background: 'var(--accent-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <UserPlus color="white" size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Choose your role and start your journey</p>
        </div>

        {/* Role Selection */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button"
            onClick={() => setRole('candidate')}
            className="glass"
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border: role === 'candidate' ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              background: role === 'candidate' ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)'
            }}
          >
            <User size={24} color={role === 'candidate' ? 'var(--accent-primary)' : 'var(--text-tertiary)'} />
            <span style={{ fontWeight: '600', color: role === 'candidate' ? 'white' : 'var(--text-secondary)' }}>Candidate</span>
          </button>
          <button 
            type="button"
            onClick={() => setRole('recruiter')}
            className="glass"
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border: role === 'recruiter' ? '2px solid var(--accent-secondary)' : '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              background: role === 'recruiter' ? 'rgba(168, 85, 247, 0.1)' : 'var(--glass-bg)'
            }}
          >
            <Briefcase size={24} color={role === 'recruiter' ? 'var(--accent-secondary)' : 'var(--text-tertiary)'} />
            <span style={{ fontWeight: '600', color: role === 'recruiter' ? 'white' : 'var(--text-secondary)' }}>Recruiter</span>
          </button>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                className="glass"
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 'var(--radius-lg)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                className="glass"
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 'var(--radius-lg)', color: 'white' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={18} />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="glass"
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: 'var(--radius-lg)', color: 'white' }}
              />
            </div>
          </div>

          {role === 'recruiter' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Company Name</label>
              <div style={{ position: 'relative' }}>
                <Building style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={18} />
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Tech Solutions LLC"
                  required={role === 'recruiter'}
                  className="glass"
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: 'var(--radius-lg)', color: 'white' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={18} />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="glass"
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: 'var(--radius-lg)', color: 'white' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1rem',
              padding: '0.875rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--accent-gradient)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? {' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

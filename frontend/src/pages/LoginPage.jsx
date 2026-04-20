import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
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
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh' 
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
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
            <LogIn color="white" size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your credentials to access your account</p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)', paddingLeft: '0.2rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                style={{ 
                  position: 'absolute', 
                  left: '1.2rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--accent-primary)',
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))'
                }} 
                size={18} 
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yassine@example.com"
                required
                className="glass-input"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  borderRadius: 'var(--radius-xl)',
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)', paddingLeft: '0.2rem' }}>Password</label>
            <div style={{ position: 'relative', transition: 'var(--transition)' }}>
              <Lock 
                style={{ 
                  position: 'absolute', 
                  left: '1.2rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--accent-primary)',
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))'
                }} 
                size={18} 
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="glass-input"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  borderRadius: 'var(--radius-xl)',
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '1rem'
                }}
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
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? {' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

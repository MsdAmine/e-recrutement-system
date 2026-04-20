import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';

// Placeholder Pages
const Home = () => (
  <div className="container animate-fade-in">
    <header style={{ textAlign: 'center', padding: '4rem 0' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
        Find Your <span className="gradient-text">Dream Job</span> Today
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        The next generation recruitment platform connecting top talent with innovative companies.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className="glass" style={{ 
          padding: '0.75rem 2rem', 
          borderRadius: 'var(--radius-lg)',
          background: 'var(--accent-gradient)',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>Browse Jobs</button>
        <button className="glass" style={{ 
          padding: '0.75rem 2rem', 
          borderRadius: 'var(--radius-lg)',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>Post a Job</button>
      </div>
    </header>
    
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '2rem 0' }}>
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>For Candidates</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Apply to thousands of jobs with one click and track your applications in real-time.</p>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>For Recruiters</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your job offers and applications with powerful tools designed for efficiency.</p>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Real-time Notifications</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Stay updated on your application status or new applicants with our instant notification system.</p>
      </div>
    </section>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="container">
      <h2>Welcome, {user?.firstName}!</h2>
      <p>Role: {user?.role}</p>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Add more routes here */}
            </Routes>
          </main>
          <footer style={{ 
            padding: '2rem 0', 
            textAlign: 'center', 
            color: 'var(--text-tertiary)',
            borderTop: '1px solid var(--border)',
            marginTop: '4rem'
          }}>
            <p>&copy; 2026 E-Recruit. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

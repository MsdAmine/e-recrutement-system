import React from 'react';
import { useAuth } from '../context/AuthContext';
import CandidateDashboard from '../components/dashboard/CandidateDashboard';
import RecruiterDashboard from '../components/dashboard/RecruiterDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Hello, <span className="gradient-text">{user?.firstName}</span>!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here's what's happening with your {user?.role === 'ROLE_CANDIDATE' ? 'applications' : 'recruitment'} today.
        </p>
      </header>

      {user?.role === 'ROLE_CANDIDATE' ? (
        <CandidateDashboard />
      ) : (
        <RecruiterDashboard />
      )}
    </div>
  );
};

export default DashboardPage;

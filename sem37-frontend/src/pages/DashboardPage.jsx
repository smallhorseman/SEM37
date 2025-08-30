import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Welcome to the SEM37 Dashboard</h1>
      <p style={{ marginTop: '1rem' }}>You are logged in and can see this secure page.</p>
      <button
        onClick={logout}
        style={{ marginTop: '1.5rem', borderRadius: '0.375rem', backgroundColor: '#1f2937', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '600', color: 'white' }}
      >
        Log Out
      </button>
    </div>
  );
}
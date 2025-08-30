import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Call the login function from our AuthContext
    const success = await login(email, password);

    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
    // If login is successful, we will handle the redirect in App.jsx
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
          SEM37 Login
        </h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: 'block', width: '100%', borderRadius: '0.375rem', border: '1px solid #d1d5db', padding: '0.5rem' }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ display: 'block', width: '100%', borderRadius: '0.375rem', border: '1px solid #d1d5db', padding: '0.5rem' }}
            />
          </div>
          {error && <p style={{ fontSize: '0.875rem', color: '#ef4444', textAlign: 'center' }}>{error}</p>}
          <div>
            <button
              type="submit"
              style={{ display: 'flex', width: '100%', justifyContent: 'center', borderRadius: '0.375rem', backgroundColor: '#1f2937', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: 'white' }}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
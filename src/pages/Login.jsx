import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password, role);
      login(data.role, data.user);
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 44%', background: 'var(--accent)', color: '#fff',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative shapes */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>CourseReserve</span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', maxWidth: '360px' }}>
            Course registration made simple.
          </h1>
          <p style={{ marginTop: '16px', fontSize: '1rem', opacity: 0.75, maxWidth: '320px', lineHeight: 1.6 }}>
            Manage your academic courses, reservations, and enrollments — all in one place.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.875rem', opacity: 0.5 }}>2026 · Course Portal</p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px', background: 'var(--bg)',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Continue to your portal
          </p>

          {error && <div className="alert alert-error mb-4">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-input"
                placeholder={role === 'student' ? 'student@example.com' : 'admin@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Quick-fill Demo Credentials */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem'
          }}>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Quick Demo Logins:
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setRole('student');
                  setEmail('student@example.com');
                  setPassword('password123');
                }}
              >
                👤 Student (Sanjai Mani)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setRole('admin');
                  setEmail('admin@example.com');
                  setPassword('admin123');
                }}
              >
                🛡️ Admin
              </button>
            </div>
            <div style={{ marginTop: '10px', color: 'var(--text-tertiary)', fontSize: '0.75rem', lineHeight: 1.5 }}>
              <div>Student: <code>student@example.com</code> / <code>password123</code></div>
              <div>Admin: <code>admin@example.com</code> / <code>admin123</code></div>
            </div>
          </div>

          <p style={{ marginTop: '20px', fontSize: '0.8125rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            CourseReserve · Online Course Reservation System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

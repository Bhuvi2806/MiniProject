import { useState } from 'react';
import './Login.css';

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER / DEMO AUTH — Phase 2 frontend-only gate.
// Real authentication (JWT + bcrypt via Express/MongoDB) is implemented in
// Phase 1 backend (routes/auth.js) and will replace this entirely before
// the app goes to production. Do NOT treat this as a real security mechanism.
//
// Auth rules (per updated kickoff spec):
//   User role     → access code must fully match /^1+$/
//                   (one or more "1" characters, nothing else — "1", "11", "111" all valid)
//   Hospital role → access code must fully match /^2+$/
//                   (one or more "2" characters, nothing else — "2", "22", "222" all valid)
// ─────────────────────────────────────────────────────────────────────────────
const USER_PATTERN     = /^1+$/;   // any length, all-1s
const HOSPITAL_PATTERN = /^2+$/;   // any length, all-2s

export default function Login({ onLogin }) {
  const [role, setRole]           = useState('user'); // 'user' | 'hospital'
  const [accessCode, setAccessCode] = useState('');
  const [error, setError]         = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setAccessCode('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // ── Demo auth: regex-only check, no DB lookup ──
    if (role === 'user' && USER_PATTERN.test(accessCode)) {
      onLogin({ role: 'user', token: null }); // token is null — demo only
    } else if (role === 'hospital' && HOSPITAL_PATTERN.test(accessCode)) {
      onLogin({ role: 'hospital', token: null });
    } else {
      // Intentionally vague — don't hint at the pattern
      setError('Invalid access code for the selected role. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container card">
        {/* ── Logo / Header ── */}
        <div className="login-header">
          <div className="login-logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0c0-5-8-13-8-13z" fill="#DC2626"/>
              <path d="M12 6c0 0-4 4.5-4 7.5a4 4 0 008 0c0-3-4-7.5-4-7.5z" fill="#fff" opacity="0.3"/>
            </svg>
          </div>
          <h1 className="headline-lg">BloodLink</h1>
          <p className="body-sm text-muted">Demo Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* ── Role toggle ── */}
          <div className="role-toggle" role="group" aria-label="Select your role">
            <button
              id="role-user"
              type="button"
              className={`role-toggle__btn ${role === 'user' ? 'role-toggle__btn--active' : ''}`}
              onClick={() => handleRoleChange('user')}
              aria-pressed={role === 'user'}
            >
              User (Donor / Patient)
            </button>
            <button
              id="role-hospital"
              type="button"
              className={`role-toggle__btn ${role === 'hospital' ? 'role-toggle__btn--active' : ''}`}
              onClick={() => handleRoleChange('hospital')}
              aria-pressed={role === 'hospital'}
            >
              Hospital Dispatch
            </button>
          </div>

          {/* ── Access code field ── */}
          <div className="login-field">
            <label className="label-md" htmlFor="access-code">Access Code</label>
            <input
              id="access-code"
              type="password"
              className="input"
              value={accessCode}
              onChange={(e) => { setAccessCode(e.target.value); setError(''); }}
              placeholder={role === 'user' ? 'Enter user access code' : 'Enter hospital access code'}
              autoComplete="off"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          {/* ── Inline error ── */}
          {error && (
            <p id="login-error" className="body-sm text-primary login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary login-submit" id="login-submit-btn">
            Access Portal
          </button>
        </form>

        {/* ── Footer notice ── */}
        <div className="login-footer">
          <p className="label-md text-muted" style={{ textAlign: 'center' }}>
            ⚠️ <strong>Demo Mode</strong><br/>
            This is a frontend-only access gate. Real JWT + bcrypt authentication
            is implemented in the Phase 1 backend and replaces this before production.
          </p>
        </div>
      </div>
    </div>
  );
}

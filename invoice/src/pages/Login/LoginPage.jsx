import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import { AlertCircle } from 'lucide-react';
import './LoginPage.css';

function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="login-wrapper">
      <div className="login-split">
        <div className="login-brand-panel">
          <div className="login-ledger-lines"></div>

          <div className="login-brandmark">
            <div className="mark">Z</div>
            <div className="word">Zephy</div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="login-hero">
              <span className="eyebrow">Invoicing workspace</span>
              <h1>Send invoices <em>people actually pay.</em></h1>
              <p>Track clients, chase payments automatically, and see your cash flow in one calm workspace built for freelancers and small studios.</p>
            </div>

            <div className="login-invoice-stage">
              <div className="login-invoice-card">
                <div className="login-stamp">PAID</div>
                <div className="row">
                  <span className="no">INV-0842</span>
                  <span className="no">Due Jul 30</span>
                </div>
                <div className="amt">$4,250.00</div>
                <div className="client">Marlowe &amp; Finch Studio</div>
                <div className="bar"><span></span></div>
              </div>
            </div>
          </div>


        </div>

        {/* Right Side: Auth Form */}
        <div className="login-form-panel">
          <div className="mobile-logo">
            <div className="logo-box">Z</div>
            <span>Zephy</span>
          </div>
          <div className="login-card">
            <h2>Welcome back</h2>
            <p className="sub">Sign in to your workspace</p>

            {/* Error Alert */}
            {error && (
              <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="email">Email address</label>
                <div className="login-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" opacity="0" /><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z" /><path d="m3.5 6 8.5 6.5L20.5 6" /></svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>
                <div className="login-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    className="login-toggle-eye"
                    type="button"
                    aria-label="Show password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="login-row-between">
                <a href="#">Forgot password?</a>
              </div>

              <button className="login-btn-primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
                {!isLoading && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>}
              </button>

              <div className="login-security-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                Your data is encrypted end-to-end
              </div>

              <div className="login-divider"><span>Or continue with</span></div>

              <div className="login-google-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                />
              </div>

              <p className="login-signup-line">Don't have a workspace? <a href="#">Create one</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

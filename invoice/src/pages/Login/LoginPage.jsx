import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

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
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
    <div className="login-page">
      {/* Left Panel — Brand */}
      <div className="login-left-panel">
        {/* Decorative blobs */}
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />

        <div className="login-left-content">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon" style={{ background: '#FFFFFF', border: '1px solid rgba(255,255,255,0.1)', padding: 6, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/zephy.png" alt="Zephy Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            </div>
            <div>
              <h1 className="login-brand-name">
                Zephy
              </h1>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '10%' }}>
            {/* Headline */}
            <div className="login-headline" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <h2 className="login-headline-title" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em', fontWeight: 700 }}>
                Elevate your <br />
                <span style={{ color: 'var(--gold)' }}>invoicing</span> experience.
              </h2>
              <p className="login-headline-sub" style={{ fontSize: '1.2rem', opacity: 0.85, lineHeight: 1.6, maxWidth: 480 }}>
                Your professional workspace to manage clients, track payments, and send stunning invoices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="login-right-panel">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-sub">Sign in to your workspace</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="login-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email Field */}
            <div className="login-field">
              <label className={`login-label ${email || emailFocused ? 'login-label-active' : ''}`}>
                Email Address
              </label>
              <div className="login-input-wrap">
                <Mail className={`login-input-icon ${emailFocused ? 'login-input-icon-active' : ''}`} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="name@example.com"
                  className="login-input"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field">
              <label className={`login-label ${password || passwordFocused ? 'login-label-active' : ''}`}>
                Password
              </label>
              <div className="login-input-wrap">
                <Lock className={`login-input-icon ${passwordFocused ? 'login-input-icon-active' : ''}`} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className="login-input login-input-pw"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? (
                <>
                  <span className="login-spinner" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 login-btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="login-separator">
            <span>or continue with</span>
          </div>

          <div className="login-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;

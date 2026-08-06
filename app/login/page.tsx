'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from './actions';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let result;
      if (isLogin) {
        result = await login(null, formData);
      } else {
        result = await register(null, formData);
      }

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        if (!isLogin) {
          setSuccess('Account created successfully! Signing you in...');
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 1500);
        } else {
          router.push('/');
          router.refresh();
        }
      }
    });
  };

  return (
    <div className="auth-page-container">
      
      {/* Left Column (40%): Minimal Branding & 3 Feature Rows */}
      <div className="auth-branding-left">
        <div>
          <div className="brand-header">
            <img 
              src="/logo.png" 
              alt="CyberSafe Logo" 
              style={{ width: '44px', height: 'auto', objectFit: 'contain' }}
            />
            <div>
              <h1 className="brand-name">CyberSafe</h1>
              <p className="brand-tagline">Enterprise malware intelligence.</p>
            </div>
          </div>
        </div>

        {/* Three concise feature rows */}
        <div className="features-list">
          <div className="feature-row">
            <div className="feature-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="feature-text">90+ Threat Engines</span>
          </div>

          <div className="feature-row">
            <div className="feature-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span className="feature-text">Privacy-First Analysis</span>
          </div>

          <div className="feature-row">
            <div className="feature-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span className="feature-text">Unified Security Reports</span>
          </div>
        </div>
      </div>

      {/* Right Column (60%): Floating Floating Apple Authentication Card */}
      <div className="auth-card-right">
        <div className="apple-card-white">
          
          {/* Card Header */}
          <div className="card-header">
            <h2 className="card-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="card-subtitle">
              {isLogin ? 'Sign in to continue to CyberSafe.' : 'Get started with Enterprise malware intelligence.'}
            </p>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="alert alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="name">Full Name</label>
                </div>
                <input 
                  id="name"
                  name="name" 
                  type="text" 
                  placeholder="Jane Doe" 
                  className="form-input"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="email">Email Address</label>
              </div>
              <input 
                id="email"
                name="email" 
                type="email" 
                placeholder="name@company.com" 
                className="form-input"
                required 
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="password">Password</label>
                {isLogin && (
                  <a 
                    href="#forgot" 
                    onClick={(e) => { e.preventDefault(); setError('Password reset instructions will be sent to your email.'); }}
                    className="form-forgot-link"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>
              <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="••••••••" 
                className="form-input"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                </div>
                <input 
                  id="confirmPassword"
                  name="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  className="form-input"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            {/* Remember me checkbox */}
            {isLogin && (
              <div 
                className={`checkbox-row ${rememberMe ? 'checked' : ''}`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div className="custom-checkbox">
                  {rememberMe && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="checkbox-label">Remember me</span>
              </div>
            )}

            {/* Primary Sign In Button */}
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'meshFloat1 1.5s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Verifying...
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-container">
            <div className="divider-line" />
            <span className="divider-text">OR</span>
            <div className="divider-line" />
          </div>

          {/* OAuth Buttons */}
          <div className="oauth-grid">
            <button 
              type="button" 
              className="btn-oauth"
              onClick={() => setError('Apple Authentication will be available when deployed.')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.86-.99 2.96 1.07.08 2.16-.55 2.82-1.36z" />
              </svg>
              Apple
            </button>

            <button 
              type="button" 
              className="btn-oauth"
              onClick={() => setError('Google Authentication will be available when deployed.')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>
          </div>

          {/* Toggle Footer Link */}
          <div className="card-footer-text">
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <button 
              type="button" 
              onClick={handleToggle}
              className="card-footer-btn"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

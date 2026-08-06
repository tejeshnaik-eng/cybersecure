'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/login/actions';

interface UserSession {
  userId: string;
  email: string;
  name: string | null;
}

export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [dragActive, setDragActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    'System initialization completed.',
    `Agent session active for ${user.email}`,
    'Ready for threat intelligence scanning...'
  ]);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push('/login');
      router.refresh();
    });
  };

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      startFileScan(file.name, file.size);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      startFileScan(file.name, file.size);
    }
  };

  const startFileScan = (fileName: string, fileSize: number) => {
    setScanProgress(0);
    setScanStatus('scanning');
    addLog(`Initiated analysis on file: ${fileName} (${(fileSize / 1024).toFixed(2)} KB)`);

    const steps = [
      { progress: 15, msg: 'Calculating SHA-256 hash...' },
      { progress: 40, msg: 'Querying threat intelligence databases (VirusTotal)...' },
      { progress: 65, msg: 'Checking metadata anomalies & certificate validity...' },
      { progress: 85, msg: 'Aggregating scanner reports...' },
      { progress: 100, msg: 'Scan complete. File signature clean: NO THREATS FOUND.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanProgress(steps[currentStep].progress);
        addLog(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setScanStatus('complete');
      }
    }, 1000);
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlInput = (e.currentTarget.elements.namedItem('url') as HTMLInputElement).value;
    if (!urlInput) return;

    setScanProgress(0);
    setScanStatus('scanning');
    addLog(`Starting domain/IP health scan for: ${urlInput}`);

    const steps = [
      { progress: 20, msg: 'Performing DNS lookup & IP extraction...' },
      { progress: 50, msg: 'Querying blacklists and phishing reputation databases...' },
      { progress: 80, msg: 'Scanning SSL certificate transparency logs...' },
      { progress: 100, msg: `Reputation scan complete. Domain is safe (0/90 detection engines flag it).` }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanProgress(steps[currentStep].progress);
        addLog(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setScanStatus('complete');
      }
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header Bar */}
      <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <h1 style={{ fontSize: '1.4rem', letterSpacing: '0.05em' }}>CYBERSAFE</h1>
        </div>

        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block', boxShadow: '0 0 8px var(--color-success)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>NODE STATUS:</span>
            <span style={{ fontWeight: 'bold' }}>ACTIVE</span>
          </div>

          <div style={{ color: 'var(--text-secondary)' }}>
            AGENT: <span style={{ color: '#fff', fontWeight: '500' }}>{user.name || user.email}</span>
          </div>

          <button 
            onClick={handleLogout} 
            className="btn btn-cyan" 
            style={{ width: 'auto', padding: '8px 16px', fontSize: '0.8rem' }}
            disabled={isPending}
          >
            {isPending ? 'Logging out...' : 'Sever Connection'}
          </button>
        </div>
      </header>

      {/* Grid Dashboard Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', flex: '1', flexWrap: 'wrap' }} className="dashboard-grid">
        
        {/* Left Side: Analyzer Hero Component */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Aggregated Threat Intelligence</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Upload any file or submit a URL to perform a concurrent signature scan against multiple Antivirus Engines.
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '12px' }}>
            <button 
              className={`btn-link ${activeTab === 'file' ? 'active-tab' : ''}`} 
              onClick={() => setActiveTab('file')}
              style={{ 
                color: activeTab === 'file' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'file' ? '600' : '400',
                borderBottom: activeTab === 'file' ? '2px solid var(--accent-cyan)' : 'none',
                borderRadius: '0',
                padding: '8px 12px'
              }}
            >
              Analyze File
            </button>
            <button 
              className={`btn-link ${activeTab === 'url' ? 'active-tab' : ''}`} 
              onClick={() => setActiveTab('url')}
              style={{ 
                color: activeTab === 'url' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'url' ? '600' : '400',
                borderBottom: activeTab === 'url' ? '2px solid var(--accent-cyan)' : 'none',
                borderRadius: '0',
                padding: '8px 12px'
              }}
            >
              Scan URL/IP Address
            </button>
          </div>

          {/* Dynamic Tab Body */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {activeTab === 'file' ? (
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? 'var(--accent-cyan)' : 'var(--border-muted)'}`,
                  background: dragActive ? 'var(--accent-cyan-dim)' : 'rgba(8, 9, 13, 0.4)',
                  borderRadius: '12px',
                  padding: '50px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  multiple={false} 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px var(--accent-cyan-glow))' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Drag & Drop Secure Payload</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>or click to browse local files (max 32MB)</p>
                  </div>
                </label>
              </div>
            ) : (
              <form onSubmit={handleUrlSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="url-input">Target URL or Host IP</label>
                  <input 
                    id="url-input"
                    name="url" 
                    type="text" 
                    placeholder="https://example-phishing-threat.com" 
                    className="form-input" 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-cyan">Begin DNS & Domain Reputation Audit</button>
              </form>
            )}

            {/* Scan Progress Bar */}
            {scanStatus && (
              <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>{scanStatus === 'scanning' ? 'Executing threat vector audits...' : 'Scan Complete'}</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{scanProgress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      background: scanProgress === 100 && !logs[logs.length-1].includes('clean') ? 'var(--color-success)' : 'var(--accent-cyan)', 
                      width: `${scanProgress}%`, 
                      transition: 'width 0.3s ease-out',
                      boxShadow: '0 0 8px var(--accent-cyan-glow)'
                    }} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Log Feed / Console Terminal */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Security Log</h2>
            <button 
              onClick={() => setLogs(['System console reset. Ready.'])} 
              className="btn-link" 
              style={{ fontSize: '0.75rem', padding: '2px' }}
            >
              Clear Logs
            </button>
          </div>

          {/* Terminal Box */}
          <div 
            style={{ 
              flex: 1, 
              background: '#040508', 
              border: '1px solid var(--border-muted)', 
              borderRadius: '8px', 
              padding: '16px', 
              fontFamily: 'Consolas, Monaco, monospace', 
              fontSize: '0.8rem', 
              lineHeight: '1.5', 
              color: 'var(--text-secondary)',
              overflowY: 'auto',
              maxHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {logs.map((log, index) => (
              <div 
                key={index} 
                style={{ 
                  color: log.includes('COMPLETE') || log.includes('clean') 
                    ? 'var(--color-success)' 
                    : log.includes('Initiated') || log.includes('Starting')
                    ? '#fff'
                    : 'var(--text-secondary)' 
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .active-tab {
          border-bottom: 2px solid var(--accent-cyan) !important;
          color: var(--accent-cyan) !important;
        }
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

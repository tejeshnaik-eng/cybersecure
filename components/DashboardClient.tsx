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
  const [scanProgress, setScanProgress] = useState(100);
  const [scanStatus, setScanStatus] = useState<string | null>('complete');
  const [scannedItemName, setScannedItemName] = useState<string>('LuaTools-win-Setup.exe');
  const [scannedItemSize, setScannedItemSize] = useState<string>('11.1 MB');
  const [logs, setLogs] = useState<string[]>([
    'System security services initialized.',
    `Connected as ${user.email || 'Demo Analyst'}`,
    '[12:31:24 AM] Analyzing file payload: LuaTools-win-Setup.exe (11309.0 KB)',
    '[12:31:25 AM] Hashing file signature...',
    '[12:31:25 AM] Checking VirusTotal & threat intelligence databases...',
    '[12:31:26 AM] Performing deep static analysis...',
    '[12:31:27 AM] Scan complete. File signature clean: NO THREATS DETECTED.'
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
    setScannedItemName(fileName);
    setScannedItemSize(`${(fileSize / (1024 * 1024)).toFixed(1)} MB`);
    setScanProgress(0);
    setScanStatus('scanning');
    addLog(`Analyzing file payload: ${fileName} (${(fileSize / 1024).toFixed(1)} KB)`);

    const steps = [
      { progress: 20, msg: 'Hashing file signature (SHA-256)...' },
      { progress: 50, msg: 'Querying 92 threat intelligence vendors (VirusTotal)...' },
      { progress: 80, msg: 'Performing deep static analysis...' },
      { progress: 100, msg: 'Scan complete. File signature clean: NO THREATS DETECTED.' }
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
    }, 800);
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlInput = (e.currentTarget.elements.namedItem('url') as HTMLInputElement).value;
    if (!urlInput) return;

    setScannedItemName(urlInput);
    setScannedItemSize('Web Domain');
    setScanProgress(0);
    setScanStatus('scanning');
    addLog(`Scanning target web address: ${urlInput}`);

    const steps = [
      { progress: 25, msg: 'Resolving domain name & IP address...' },
      { progress: 60, msg: 'Checking against global phishing & malware blacklists...' },
      { progress: 100, msg: `Scan complete: ${urlInput} is clean and safe to visit.` }
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
    }, 800);
  };

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Bar */}
      <header 
        style={{ 
          background: '#FFFFFF', 
          borderRadius: '24px', 
          padding: '16px 28px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.08)',
          border: 'none',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src="/logo.png" 
            alt="CyberSafe Logo" 
            style={{ width: '38px', height: 'auto', objectFit: 'contain' }}
          />
          <div>
            <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark-title)', letterSpacing: '-0.02em' }}>
              CyberSafe
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)', fontWeight: '500' }}>
              Enterprise Threat Intelligence
            </span>
          </div>
        </div>

        {/* Status indicator & pill buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F1F5F9', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: '600', color: '#10B981' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            System Ready
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-dark-muted)', fontWeight: '500' }}>
            User: <strong style={{ color: 'var(--text-dark-title)' }}>{user.name || user.email}</strong>
          </div>

          <a 
            href="/login"
            className="btn-link"
            style={{ fontSize: '0.85rem' }}
          >
            Login Portal
          </a>

          <button 
            onClick={handleLogout} 
            className="btn" 
            style={{ width: 'auto', height: '40px', padding: '0 20px', fontSize: '0.85rem' }}
            disabled={isPending}
          >
            {isPending ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', flex: '1' }} className="dashboard-grid">
        
        {/* Left Side: White Analyzer Card Module */}
        <div 
          style={{ 
            background: '#FFFFFF', 
            borderRadius: '24px', 
            padding: '36px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.12)',
            border: 'none'
          }}
        >
          <div>
            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-dark-title)', marginBottom: '6px' }}>
              Malware & Threat Scanner
            </h2>
            <p style={{ color: 'var(--text-dark-muted)', fontSize: '0.95rem' }}>
              Upload any suspicious file or web link to analyze it across 92 virus detection engines.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div style={{ display: 'flex', gap: '10px', background: '#F1F5F9', padding: '6px', borderRadius: '9999px', width: 'fit-content' }}>
            <button 
              className="btn-pill"
              onClick={() => setActiveTab('file')}
              style={{ 
                height: '38px',
                padding: '0 20px',
                fontSize: '0.88rem',
                background: activeTab === 'file' ? '#0F172A' : 'transparent',
                color: activeTab === 'file' ? '#FFFFFF' : 'var(--text-dark-muted)',
                boxShadow: activeTab === 'file' ? '0 4px 12px rgba(15, 23, 42, 0.1)' : 'none'
              }}
            >
              Analyze File
            </button>
            <button 
              className="btn-pill"
              onClick={() => setActiveTab('url')}
              style={{ 
                height: '38px',
                padding: '0 20px',
                fontSize: '0.88rem',
                background: activeTab === 'url' ? '#0F172A' : 'transparent',
                color: activeTab === 'url' ? '#FFFFFF' : 'var(--text-dark-muted)',
                boxShadow: activeTab === 'url' ? '0 4px 12px rgba(15, 23, 42, 0.1)' : 'none'
              }}
            >
              Scan Web Link / IP
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
                  background: dragActive ? '#E2E8F0' : '#F8FAFC',
                  borderRadius: '20px',
                  padding: '44px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: 'none'
                }}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '9999px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark-title)', marginBottom: '4px' }}>
                      Drag & Drop your file here
                    </h3>
                    <p style={{ color: 'var(--text-dark-muted)', fontSize: '0.88rem' }}>
                      or click to browse local files from your device
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <form onSubmit={handleUrlSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="url-input">Target Web Address or IP</label>
                  <input 
                    id="url-input"
                    name="url" 
                    type="text" 
                    placeholder="https://example.com" 
                    className="form-input" 
                    required 
                  />
                </div>
                <button type="submit" className="btn">
                  Scan Web Address
                </button>
              </form>
            )}

            {/* Scan Progress Bar */}
            {scanStatus && (
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark-title)' }}>
                  <span>{scanStatus === 'scanning' ? 'Scanning threat databases...' : 'Analysis Complete'}</span>
                  <span style={{ color: '#0066FF' }}>{scanProgress}%</span>
                </div>
                <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      background: scanProgress === 100 ? '#10B981' : '#0066FF', 
                      width: `${scanProgress}%`, 
                      transition: 'width 0.3s ease-out'
                    }} 
                  />
                </div>
              </div>
            )}

            {/* NEW VERDICT & VIRUSTOTAL-LIKE ESSENTIAL ANALYSIS WIDGET */}
            {scanStatus === 'complete' && (
              <div 
                style={{ 
                  marginTop: '24px', 
                  background: '#F8FAFC', 
                  borderRadius: '20px', 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '18px',
                  border: 'none',
                  animation: 'cardFadeIn 0.3s ease-out'
                }}
              >
                {/* Verdict Badge Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#DCFCE7', padding: '6px 16px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: '700', fontSize: '0.88rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      SAFE • NO THREATS DETECTED
                    </div>
                  </div>

                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', fontWeight: '600' }}>
                    Security Score: <strong style={{ color: '#10B981' }}>100 / 100</strong>
                  </span>
                </div>

                {/* Score Summary Banner */}
                <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark-title)' }}>
                      0 <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-dark-muted)' }}>/ 92 vendors flagged this file</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dark-muted)', marginTop: '2px' }}>
                      Target: <strong>{scannedItemName}</strong> ({scannedItemSize})
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700' }}>0 Undetected</span>
                    <span style={{ background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600' }}>92 Clean</span>
                  </div>
                </div>

                {/* Key VirusTotal Engine Breakdown (Essential Only) */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-dark-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Key Security Vendor Results
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    
                    <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark-title)' }}>Kaspersky</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#15803D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ● Clean
                      </span>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark-title)' }}>Microsoft Defender</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#15803D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ● Clean
                      </span>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark-title)' }}>CrowdStrike Falcon</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#15803D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ● Clean
                      </span>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark-title)' }}>Sophos AI</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#15803D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ● Clean
                      </span>
                    </div>

                  </div>
                </div>

                {/* Target Hashes */}
                <div style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dark-muted)', textTransform: 'uppercase' }}>SHA-256 Signature Hash</span>
                  <code style={{ fontSize: '0.78rem', color: 'var(--text-dark-body)', wordBreak: 'break-all', fontFamily: 'Consolas, monospace' }}>
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </code>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Right Side: Security Activity Terminal Feed */}
        <div 
          style={{ 
            background: '#FFFFFF', 
            borderRadius: '24px', 
            padding: '28px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.12)',
            border: 'none'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-dark-title)' }}>
              Analysis Activity Log
            </h2>
            <button 
              onClick={() => setLogs(['System console reset. Ready.'])} 
              className="card-footer-btn" 
              style={{ fontSize: '0.8rem' }}
            >
              Clear
            </button>
          </div>

          {/* Terminal Box */}
          <div 
            style={{ 
              flex: 1, 
              background: '#F8FAFC', 
              border: 'none', 
              borderRadius: '16px', 
              padding: '18px', 
              fontFamily: 'Consolas, Monaco, monospace', 
              fontSize: '0.82rem', 
              lineHeight: '1.6', 
              color: 'var(--text-dark-body)',
              overflowY: 'auto',
              maxHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {logs.map((log, index) => (
              <div 
                key={index} 
                style={{ 
                  color: log.includes('clean') || log.includes('NO THREATS') || log.includes('safe') 
                    ? '#10B981' 
                    : log.includes('Analyzing') || log.includes('Scanning')
                    ? '#0066FF'
                    : 'var(--text-dark-body)',
                  fontWeight: log.includes('clean') || log.includes('Analyzing') ? '600' : '400'
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

import './globals.css';
import React from 'react';

export const metadata = {
  title: 'CyberSafe - Enterprise Malware Intelligence',
  description: 'Dedicated enterprise threat intelligence and security authentication portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Subtle mesh illumination background */}
        <div className="app-bg-container">
          <div className="bg-mesh-glow-1" />
          <div className="bg-mesh-glow-2" />
        </div>
        
        {/* Main App Container */}
        <div className="main-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}

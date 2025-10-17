import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Unipile Inbox MVP',
  description: 'Unified inbox MVP using Unipile Webhooks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="header">
            <h1>Unipile Inbox MVP</h1>
            <a className="btn ghost" href="/inbox">Inbox</a>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

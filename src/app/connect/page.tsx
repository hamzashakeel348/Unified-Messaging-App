'use client';
import { useEffect, useState } from 'react';

export default function Connect({ searchParams }: { searchParams: { provider?: string } }) {
  const provider = (searchParams.provider || 'LINKEDIN').toUpperCase();
  const [authUrl, setAuthUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const go = async () => {
      try {
        const r = await fetch(`/api/unipile/auth-link?provider=${provider}`);
        const d = await r.json();
        if (d.url) setAuthUrl(d.url);
        else setError(d.error || 'Failed to get auth URL');
      } catch (e:any) {
        setError(e?.message || 'Failed');
      }
    };
    go();
  }, [provider]);

  return (
    <div className="card">
      <h2>Connect {provider === 'GOOGLE' ? 'Gmail' : 'LinkedIn'}</h2>
      {authUrl ? (
        <a className="btn" href={authUrl}>Continue to {provider} Auth</a>
      ) : error ? (
        <p style={{color:'#fca5a5'}}>{error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

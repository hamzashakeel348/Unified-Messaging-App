import Link from 'next/link';

export default function Home() {
  return (
    <div className="col">
      <div className="card">
        <h2>Connect accounts</h2>
        <p>Use Unipile Hosted Auth to connect LinkedIn and Gmail for this MVP.</p>
        <div className="row">
          <Link className="btn" href="/connect?provider=LINKEDIN">Connect LinkedIn</Link>
          <Link className="btn" href="/connect?provider=GOOGLE">Connect Gmail</Link>
          <Link className="btn ghost" href="/inbox">Go to Inbox</Link>
        </div>
      </div>
    </div>
  );
}

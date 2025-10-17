'use client';
import { useEffect, useState } from 'react';

type Message = {
  _id: string;
  platform: 'google'|'linkedin';
  account_id?: string;
  chat_id?: string;      // LinkedIn chat id
  email_id?: string;     // Unipile email id
  provider_message_id?: string; // e.g., Gmail <...@mail.gmail.com>
  from: string;
  to: string;
  subject?: string;
  text?: string;
  created_at: string;
};

export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all'|'google'|'linkedin'>('all');
  const [selected, setSelected] = useState<Message|null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    const load = async () => {
      const url = filter === 'all' ? '/api/messages' : `/api/messages?platform=${filter}`;
      const r = await fetch(url);
      const d = await r.json();
      setMessages(d.messages || []);
    };
    load();
  }, [filter]);

  const send = async () => {
    if (!selected) return;
    const body: any = { platform: selected.platform, text: reply };
    if (selected.platform === 'linkedin') {
      body.chat_id = selected.chat_id;
    } else {
      body.account_id = selected.account_id;
      body.reply_to = selected.provider_message_id; // provider message id
      body.subject = selected.subject ? `Re: ${selected.subject}` : '(no subject)';
    }

    const r = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const d = await r.json();
    alert(d.ok ? 'Sent!' : d.error || 'Failed');
    if (d.ok) setReply('');
  };

  return (
    <div className="row">
      <aside className="card sidebar">
        <h3>Filters</h3>
        <div className="col">
          <button className="btn ghost" onClick={()=>setFilter('all')}>All</button>
          <button className="btn ghost" onClick={()=>setFilter('google')}>Gmail</button>
          <button className="btn ghost" onClick={()=>setFilter('linkedin')}>LinkedIn</button>
        </div>
        <p style={{color:'#94a3b8',marginTop:16}}>Click a message to preview and reply.</p>
      </aside>
      <main className="card" style={{flex:1}}>
        <h3>Messages</h3>
        <div className="list">
          {messages.map(m => (
            <div key={m._id} className="item" onClick={()=>setSelected(m)} style={{cursor:'pointer'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <strong>{m.subject || (m.text?.slice(0,60) || '(no subject)')}</strong>
                <small>{m.platform}</small>
              </div>
              <small>From: {m.from} → {m.to}</small>
            </div>
          ))}
          {messages.length === 0 && <p>No messages yet. Connect accounts and send yourself a test.</p>}
        </div>
      </main>
      <section className="card sidebar">
        <h3>Preview</h3>
        {selected ? (
          <div className="col">
            <div><small>{new Date(selected.created_at).toLocaleString()}</small></div>
            {selected.subject && <div><strong>{selected.subject}</strong></div>}
            <div className="message">{selected.text}</div>
            <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={6} placeholder="Type a reply..." />
            <button className="btn" onClick={send}>Send</button>
          </div>
        ) : <p>Select a message</p>}
      </section>
    </div>
  );
}

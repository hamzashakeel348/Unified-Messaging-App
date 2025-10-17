import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/unipile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { platform, text, chat_id, account_id, reply_to, subject } = await req.json();
    if (!platform || !text) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    if (platform === 'linkedin') {
      if (!chat_id) return NextResponse.json({ error: 'Missing chat_id' }, { status: 400 });
      const r = await client.messaging.sendMessage({ chat_id, text } as any);
      return NextResponse.json({ ok: true, data: r });
    }

    if (platform === 'google') {
      if (!account_id) return NextResponse.json({ error: 'Missing account_id' }, { status: 400 });

      const payload: any = {
        account_id,
        body: text,
        subject: subject || '(no subject)',
      };
      if (reply_to) payload.reply_to = reply_to;

      const r = await client.email.send(payload);
      return NextResponse.json({ ok: true, data: r });
    }

    return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
  } catch (e:any) {
    console.error('send error', e?.response?.data || e);
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}

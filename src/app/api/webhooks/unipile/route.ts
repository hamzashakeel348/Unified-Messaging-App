import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Message from '@/lib/models/Message';
import Account from '@/lib/models/Account';
import { readBody } from '@/lib/rawbody';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function verifySecret(req: NextRequest): boolean {
  const secret = process.env.UNIPILE_WEBHOOK_SECRET;
  if (!secret) return true;
  const got = req.headers.get('Unipile-Auth');
  return got === secret;
}

export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await readBody(req as any);
  await dbConnect();

  // New messages (LinkedIn etc.)
  if (body?.event && typeof body?.event === 'string' && body?.chat_id && body?.message_id && body?.account_type) {
    const type = (body.account_type || '').toUpperCase();
    if (type === 'LINKEDIN') {
      const from = body?.sender?.attendee_name || body?.sender?.attendee_provider_id || 'unknown';
      const to = Array.isArray(body?.attendees) && body.attendees[0]?.attendee_name
        ? body.attendees[0].attendee_name
        : 'unknown';

      await Message.updateOne(
        { message_id: body.message_id },
        {
          $setOnInsert: {
            platform: 'linkedin',
            message_id: body.message_id,
            chat_id: body.chat_id,
            from,
            to,
            text: body?.message || '',
            created_at: new Date(body?.timestamp || Date.now())
          }
        },
        { upsert: true }
      );
    }
  }

  // New email (Google/Microsoft/IMAP)
  if (body?.email_id && body?.account_id && body?.event && body?.from_attendee) {
    const from = body?.from_attendee?.identifier || 'unknown';
    const to = Array.isArray(body?.to_attendees) && body.to_attendees[0]?.identifier
      ? body.to_attendees[0].identifier
      : 'unknown';
    await Message.updateOne(
      { message_id: body.email_id },
      {
        $setOnInsert: {
          platform: 'google',
          account_id: body.account_id,
          message_id: body.email_id,
          provider_message_id: body?.message_id,
          email_id: body.email_id,
          from,
          to,
          subject: body?.subject || '',
          text: (body?.body_plain || body?.body || ''),
          created_at: new Date(body?.date || Date.now())
        }
      },
      { upsert: true }
    );
  }

  // Account status updates (optional, if routed here)
  if (body?.status && body?.account_id && body?.type === 'ACCOUNT_STATUS') {
    await Account.updateOne(
      { unipile_account_id: body.account_id },
      { $set: { platform: (body?.provider || '').toLowerCase() } },
      { upsert: true }
    );
  }

  return NextResponse.json({ ok: true });
}

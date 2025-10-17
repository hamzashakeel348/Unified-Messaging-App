import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Account from '@/lib/models/Account';
import { readBody } from '@/lib/rawbody';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await readBody(req as any);
  await dbConnect();

  if (body?.account_id) {
    await Account.updateOne(
      { unipile_account_id: body.account_id },
      { $set: { user_name: body?.name || undefined } },
      { upsert: true }
    );
  }
  return NextResponse.json({ ok: true });
}

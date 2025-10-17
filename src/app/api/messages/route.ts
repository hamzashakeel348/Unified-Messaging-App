import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Message from '@/lib/models/Message';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');

  await dbConnect();

  const filter: any = {};
  if (platform === 'google' || platform === 'linkedin') filter.platform = platform;

  const messages = await Message.find(filter).sort({ created_at: -1 }).limit(100).lean();
  return NextResponse.json({ messages });
}

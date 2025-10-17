import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/unipile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = (searchParams.get('provider') || 'LINKEDIN').toUpperCase();

  const success = process.env.NEXT_PUBLIC_APP_URL + '/inbox';
  const failure = process.env.NEXT_PUBLIC_APP_URL + '/';
  const notify = process.env.UNIPILE_NOTIFY_URL;

  try {
    const res = await client.account.createHostedAuthLink({
      type: 'create',
      api_url: (process.env.UNIPILE_API_URL || '').replace(/\/$/, ''),
      providers: [provider],
      success_redirect_url: success,
      failure_redirect_url: failure,
      notify_url: notify,
      expiresOn: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    } as any);

    // @ts-ignore
    const url = res?.url;
    return NextResponse.json({ url });
  } catch (e:any) {
    console.error('auth-link error', e?.response?.data || e);
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}

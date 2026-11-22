import { NextRequest, NextResponse } from 'next/server';
import { toggleLike, hasLiked } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { anon_token } = await req.json();
    if (!anon_token) {
      return NextResponse.json({ success: false, error: 'Missing visitor token' }, { status: 400 });
    }

    const result = toggleLike(params.id, anon_token);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const anonToken = searchParams.get('anon_token') || '';
    const liked = hasLiked(params.id, anonToken);
    return NextResponse.json({ success: true, liked });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

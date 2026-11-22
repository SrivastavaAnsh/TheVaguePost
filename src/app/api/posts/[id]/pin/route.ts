import { NextRequest, NextResponse } from 'next/server';
import { togglePin } from '@/lib/db';

function isAuthor(req: NextRequest): boolean {
  const cookie = req.cookies.get('vague_author_token')?.value;
  const header = req.headers.get('x-author-token');
  return cookie === 'author-auth-valid' || header === 'author-auth-valid';
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthor(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only author can pin thoughts.' },
        { status: 403 }
      );
    }

    const updated = togglePin(params.id);
    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle pin state.' },
      { status: 400 }
    );
  }
}

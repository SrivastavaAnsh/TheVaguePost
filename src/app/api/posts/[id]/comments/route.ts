import { NextRequest, NextResponse } from 'next/server';
import { getComments, createComment } from '@/lib/db';

function isAuthor(req: NextRequest): boolean {
  const cookie = req.cookies.get('vague_author_token')?.value;
  const header = req.headers.get('x-author-token');
  return cookie === 'author-auth-valid' || header === 'author-auth-valid';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = getComments(params.id);
    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (!body.content && !body.media_url) {
      return NextResponse.json({ success: false, error: 'Comment must include text, an image, or a GIF.' }, { status: 400 });
    }

    if (!body.anon_token) {
      return NextResponse.json({ success: false, error: 'Missing visitor token' }, { status: 400 });
    }

    // Check if author
    const authorActive = isAuthor(req) && Boolean(body.is_author);

    const comment = createComment({
      post_id: params.id,
      content: body.content ? body.content.trim() : '',
      media_type: body.media_type || 'none',
      media_url: body.media_url || null,
      anon_token: body.anon_token,
      is_author: authorActive,
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

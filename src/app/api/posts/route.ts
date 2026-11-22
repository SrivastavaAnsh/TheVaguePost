import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/db';

function isAuthor(req: NextRequest): boolean {
  const cookie = req.cookies.get('vague_author_token')?.value;
  const header = req.headers.get('x-author-token');
  return cookie === 'author-auth-valid' || header === 'author-auth-valid';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const pinnedOnly = searchParams.get('pinned') === 'true';

    const posts = getPosts({ category, pinnedOnly });
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthor(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only Ansh can publish thoughts on The VaguePost.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Thought content cannot be empty.' },
        { status: 400 }
      );
    }

    const post = createPost({
      title: body.title,
      content: body.content.trim(),
      category: body.category,
      media_type: body.media_type,
      media_url: body.media_url,
      is_pinned: Boolean(body.is_pinned),
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { passkey } = await req.json();
    const correctKey = process.env.ADMIN_PASSKEY || 'vaguepost2026';

    if (passkey === correctKey) {
      const response = NextResponse.json({ success: true, message: 'Author authenticated' });
      // Set author cookie for 30 days
      response.cookies.set('vague_author_token', 'author-auth-valid', {
        httpOnly: false, // Accessible to client for instant UI state
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Incorrect author passkey. Access denied.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete('vague_author_token');
  return response;
}

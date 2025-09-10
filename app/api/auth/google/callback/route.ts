import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/providers/gsc';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    
    if (!tokens) {
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    // In a real app, you'd store these tokens securely (database, encrypted cookies, etc.)
    // For demo purposes, we'll redirect with the access token as a parameter
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('gsc_token', tokens.access_token);
    redirectUrl.searchParams.set('gsc_success', 'true');

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=callback_failed', request.url));
  }
}
import { NextResponse } from 'next/server';
import { generateGoogleAuthUrl } from '@/lib/providers/gsc';

export async function GET() {
  try {
    const authUrl = generateGoogleAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('GSC auth URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
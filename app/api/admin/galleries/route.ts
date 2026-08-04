import { NextResponse } from 'next/server';
import galleriesData from '@/data/galleries.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      galleries: galleriesData.galleries || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to read gallery data' },
      { status: 500 }
    );
  }
}

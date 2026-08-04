import { NextResponse } from 'next/server';
import { getGalleriesData } from '@/lib/galleriesStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getGalleriesData();

    return NextResponse.json({
      success: true,
      galleries: data.galleries || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to read gallery data' },
      { status: 500 }
    );
  }
}
